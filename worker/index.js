
const SHOPIFY_API_VERSION = "2026-07";
const MAX_PDF_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = 7 * 1024 * 1024;

// --------------------------------------------------
// SHOPIFY GRAPHQL MUTATIONS
// --------------------------------------------------

const COMPANY_CREATE_MUTATION = `
  mutation CompanyCreate($input: CompanyCreateInput!) {
    companyCreate(input: $input) {
      company {
        id
        name
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const COMPANY_CONTACT_CREATE_MUTATION = `
  mutation CompanyContactCreate(
    $companyId: ID!
    $input: CompanyContactInput!
  ) {
    companyContactCreate(
      companyId: $companyId
      input: $input
    ) {
      companyContact {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;


const COMPANY_METAFIELDS_MUTATION = `
  mutation SaveCompanyMetafields(
    $metafields: [MetafieldsSetInput!]!
  ) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;


// --------------------------------------------------
// WORKER ROUTING
// --------------------------------------------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/wholesale-application") {
      if (request.method !== "POST") {
        return jsonResponse(
          { error: "Method not allowed." },
          405,
          { Allow: "POST" }
        );
      }

      return handleWholesaleApplication(request, env);
    }

    // Serve the existing Vite static website.
    return env.ASSETS.fetch(request);
  },
};

// --------------------------------------------------
// MAIN WHOLESALE APPLICATION HANDLER
// --------------------------------------------------

async function handleWholesaleApplication(request, env) {
  let companyId = null;
  let certificateObjectKey = null;

  try {
    const requiredEnvironmentVariables = [
      "SHOPIFY_STORE_DOMAIN",
      "SHOPIFY_CLIENT_ID",
      "SHOPIFY_CLIENT_SECRET",
      "RESALE_DOCUMENTS",
    ];

    const missing = requiredEnvironmentVariables.filter(
      (name) => !env[name]
    );

    if (missing.length > 0) {
      console.error("Missing Worker configuration:", missing);

      return jsonResponse(
        { error: "The application service is not configured." },
        500
      );
    }

    // STEP 1: Check content type and declared body size.
    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().startsWith(
      "multipart/form-data"
    )) {
      return jsonResponse(
        { error: "Expected a multipart form submission." },
        415
      );
    }

    const declaredSize = request.headers.get(
      "content-length"
    );

    if (declaredSize !== null) {
      const size = Number(declaredSize);

      if (!Number.isSafeInteger(size) || size < 0) {
        return jsonResponse(
          { error: "Invalid request size." },
          400
        );
      }

      if (size > MAX_REQUEST_SIZE) {
        return jsonResponse(
          {
            error:
              "The application exceeds the 7 MB request limit.",
          },
          413
        );
      }
    }

    // STEP 2: Count actual bytes while streaming.
    // This also works without Content-Length.
    let body;

    try {
      body = await readLimitedBody(
        request,
        MAX_REQUEST_SIZE
      );
    } catch (error) {
      if (error.message === "REQUEST_TOO_LARGE") {
        return jsonResponse(
          {
            error:
              "The application exceeds the 7 MB request limit.",
          },
          413
        );
      }

      throw error;
    }

    // STEP 3: Parse the bounded multipart body.
    let form;

    try {
      const boundedRequest = new Request(request.url, {
        method: "POST",
        headers: {
          "content-type": contentType,
        },
        body,
      });

      form = await boundedRequest.formData();
    } catch {
      return jsonResponse(
        { error: "Invalid multipart form data." },
        400
      );
    }

    const rawApplication = form.get("application");

    if (
      typeof rawApplication !== "string" ||
      rawApplication.length > 20000
    ) {
      return jsonResponse(
        { error: "Invalid application data." },
        400
      );
    }

    let application;

    try {
      application = JSON.parse(rawApplication);
    } catch {
      return jsonResponse(
        { error: "Invalid application JSON." },
        400
      );
    }

    // STEP 4: Validate application details.
    const validationError =
      validateApplication(application);

    if (validationError) {
      return jsonResponse(
        { error: validationError },
        400
      );
    }

    // STEP 5: Validate the uploaded certificate.
    const resale = application.resaleIntent === "yes";
    const certificate = form.get("resaleCertificate");

    if (resale) {
      if (!(certificate instanceof File)) {
        return jsonResponse(
          { error: "Please upload a resale certificate." },
          400
        );
      }

      if (
        certificate.size === 0 ||
        certificate.size > MAX_PDF_SIZE ||
        certificate.type !== "application/pdf"
      ) {
        return jsonResponse(
          {
            error:
              "The resale certificate must be a PDF no larger than 5 MB.",
          },
          400
        );
      }

      const signature = new TextDecoder().decode(
        await certificate.slice(0, 5).arrayBuffer()
      );

      if (signature !== "%PDF-") {
        return jsonResponse(
          { error: "The uploaded file is not a valid PDF." },
          400
        );
      }
    } else if (certificate instanceof File &&
               certificate.size > 0) {
      return jsonResponse(
        {
          error:
            "A resale certificate should only be uploaded for resale purchases.",
        },
        400
      );
    }

    // STEP 6: Authenticate using your existing
    // Shopify client credentials.
    const accessToken = await getShopifyAccessToken(env);

    // STEP 7: Create company and location.
    // No company contact or B2B role is assigned here.
    const company = await createShopifyCompany(
      application,
      env,
      accessToken
    );

    companyId = company.id;
    
    
    // STEP 8: Store the PDF privately in R2.
    // Organize documents by company name + Shopify ID.
    if (resale) {
      certificateObjectKey = await storeResaleCertificate(
        env,
        companyId,
        application.companyName,
        certificate
      );
    }


    // STEP 9: Save tax information and the R2
    // reference on the Shopify company.
    await saveCompanyTaxInformation(
      application,
      companyId,
      certificateObjectKey,
      env,
      accessToken
    );

    // STEP 10: Create contact separately.
    // No company-location role is assigned.
    const companyContact =
      await createShopifyCompanyContact(
        application,
        companyId,
        env,
        accessToken
      );

    // STEP 11: Notify administrator.
    // Email failure does not undo the application.
    let notificationSent = false;

    try {
      notificationSent = await sendNotificationEmail(
        application,
        company,
        companyContact,
        env
      );
    } catch (error) {
      console.error(
        "Wholesale notification failed:",
        String(error)
      );
    }

    return jsonResponse(
      {
        success: true,
        message:
          "Your wholesale application has been submitted and is pending approval.",
        notificationSent,
      },
      201
    );

  } catch (error) {
    console.error("Wholesale application failed:", {
      message: String(error),
      companyId,
      certificateObjectKey,
    });

    // An earlier Shopify operation may have succeeded.
    // Do not tell the applicant to submit again.
    if (companyId) {
      return jsonResponse(
        {
          error:
            "Your application was partially processed. Please contact Cadagnolo's Kitchen before submitting again.",
          partialSubmission: true,
        },
        500
      );
    }

    return jsonResponse(
      {
        error:
          "We couldn't process your application. Please try again.",
      },
      500
    );
  }
}

// --------------------------------------------------
// BOUNDED REQUEST BODY READER
// --------------------------------------------------

async function readLimitedBody(request, maxBytes) {
  if (!request.body) {
    throw new Error("Missing request body.");
  }

  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      total += value.byteLength;

      if (total > maxBytes) {
        throw new Error("REQUEST_TOO_LARGE");
      }

      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }

  return new Blob(chunks);
}

// --------------------------------------------------
// SHOPIFY AUTHENTICATION
// --------------------------------------------------

async function getShopifyAccessToken(env) {
  const shopDomain = cleanShopDomain(
    env.SHOPIFY_STORE_DOMAIN
  );

  const response = await fetch(
    `https://${shopDomain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: env.SHOPIFY_CLIENT_ID,
        client_secret: env.SHOPIFY_CLIENT_SECRET,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    console.error("Shopify authentication failed.");
    throw new Error("Shopify authentication failed.");
  }

  return data.access_token;
}

// --------------------------------------------------
// CREATE SHOPIFY COMPANY + LOCATION
// --------------------------------------------------

async function createShopifyCompany(
  application,
  env,
  accessToken
) {
  const companyName = clean(application.companyName);

  const companyLocation = {
    name: `${companyName} - Main`,
    phone: clean(application.phone),

    shippingAddress: buildAddress(
      application.shipping,
      application
    ),

    billingSameAsShipping:
      application.billingSameAsShipping === true,

    // No exemption is granted automatically.
    taxExempt: false,

    note:
      "WHOLESALE APPLICATION STATUS: PENDING APPROVAL. " +
      "Do not grant ordering or tax-exempt privileges " +
      "until the application has been reviewed.",
  };

  if (!application.billingSameAsShipping) {
    companyLocation.billingAddress = buildAddress(
      application.billing,
      application
    );
  }

  // The old taxRegistrationId / EIN mapping
  // has been removed entirely.
  const variables = {
    input: {
      company: {
        name: companyName,
        note:
          "WHOLESALE APPLICATION STATUS: PENDING APPROVAL\n" +
          "Submitted through cadagnolo.com.\n" +
          "Review the resale certificate (if applicable).\n" +
          "Applicant has not been granted B2B permissions.",
      },

      companyLocation,
    },
  };

  const data = await shopifyGraphQL(
    env,
    accessToken,
    COMPANY_CREATE_MUTATION,
    variables
  );

  const result = data.data?.companyCreate;

  if (!result?.company || result.userErrors?.length) {
    throw new Error(
      "Shopify could not create the company: " +
      formatUserErrors(result)
    );
  }

  return result.company;
}

// --------------------------------------------------
// CREATE COMPANY CONTACT, WITHOUT B2B ROLE
// --------------------------------------------------

async function createShopifyCompanyContact(
  application,
  companyId,
  env,
  accessToken
) {
  const variables = {
    companyId,
    input: {
      firstName: clean(application.firstName),
      lastName: clean(application.lastName),
      email: clean(application.email).toLowerCase(),
      phone: clean(application.phone),
    },
  };

  const data = await shopifyGraphQL(
    env,
    accessToken,
    COMPANY_CONTACT_CREATE_MUTATION,
    variables
  );

  const result = data.data?.companyContactCreate;

  if (!result?.companyContact || result.userErrors?.length) {
    throw new Error(
      "Shopify could not create the company contact: " +
      formatUserErrors(result)
    );
  }

  return result.companyContact;
}

// --------------------------------------------------
// PRIVATE R2 DOCUMENT STORAGE
// --------------------------------------------------


function slugifyCompanyName(name) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "company";
}

async function storeResaleCertificate(
  env,
  companyId,
  companyName,
  certificate
) {
  const numericCompanyId = companyId.split("/").pop();

  if (!/^\d+$/.test(numericCompanyId)) {
    throw new Error("Invalid Shopify company ID.");
  }

  const companySlug = slugifyCompanyName(companyName);

  const companyFolder =
    `${companySlug}-${numericCompanyId}`;

  const date = new Date().toISOString().slice(0, 10);

  // Random suffix ensures multiple documents uploaded
  // on the same day do not overwrite one another.
  const fileName =
    `CRT-61_${date}_${crypto.randomUUID()}.pdf`;

  const objectKey =
    `resale-certificates/${companyFolder}/${fileName}`;

  await env.RESALE_DOCUMENTS.put(
    objectKey,
    certificate.stream(),
    {
      httpMetadata: {
        contentType: "application/pdf",
        contentDisposition:
          'attachment; filename="resale-certificate.pdf"',
      },
      customMetadata: {
        companyId,
        companyName: String(companyName).slice(0, 200),
        uploadedAt: new Date().toISOString(),
        scanStatus: "unscanned",
      },
    }
  );

  return objectKey;
}


// --------------------------------------------------
// SAVE COMPANY METAFIELDS
// --------------------------------------------------


async function saveCompanyTaxInformation(
  application,
  companyId,
  objectKey,
  env,
  accessToken
) {
  const resale = application.resaleIntent === "yes";

  const values = {
    application_status: "pending",
    resale_intent: application.resaleIntent,
    tax_document_review: resale
      ? "pending"
      : "not_applicable",
  };

  if (resale) {
    values.resale_state =
      clean(application.resaleState).toUpperCase();

    values.resale_certificate_object_key = objectKey;
  }

  const metafields = Object.entries(values).map(
    ([key, value]) => ({
      ownerId: companyId,
      namespace: "wholesale",
      key,
      type: "single_line_text_field",
      value,
    })
  );

  const data = await shopifyGraphQL(
    env,
    accessToken,
    COMPANY_METAFIELDS_MUTATION,
    { metafields }
  );

  const result = data.data?.metafieldsSet;

  if (result?.userErrors?.length) {
    console.error(
      "Company metafield errors:",
      result.userErrors
    );

    throw new Error(
      result.userErrors
        .map((error) => error.message)
        .join("; ")
    );
  }

  const saved = result?.metafields || [];

  if (saved.length !== metafields.length) {
    throw new Error(
      "Shopify did not confirm all company metafields."
    );
  }

  // Verify every returned namespace/key/value pair.
  // The returned mutation selection must include value.
  for (const expected of metafields) {
    const match = saved.find(
      (field) =>
        field.namespace === expected.namespace &&
        field.key === expected.key &&
        field.value === expected.value
    );

    if (!match) {
      throw new Error(
        `Shopify did not confirm metafield ${expected.key}.`
      );
    }
  }

  console.log(
    "Company tax metafields saved:",
    companyId,
    saved.map(({ namespace, key }) => ({
      namespace,
      key,
    }))
  );

  return saved;
}


// --------------------------------------------------
// SHOPIFY GRAPHQL HELPER
// --------------------------------------------------

async function shopifyGraphQL(
  env,
  accessToken,
  query,
  variables
) {
  const shopDomain = cleanShopDomain(
    env.SHOPIFY_STORE_DOMAIN
  );

  const response = await fetch(
    `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },

      body: JSON.stringify({ query, variables }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Invalid Shopify response (${response.status}).`
    );
  }

  if (!response.ok) {
    console.error("Shopify HTTP error:", response.status);
    throw new Error("Shopify API request failed.");
  }

  if (data.errors?.length) {
    console.error("Shopify GraphQL errors:", data.errors);
    throw new Error(
      data.errors.map((item) => item.message).join("; ")
    );
  }

  return data;
}

function formatUserErrors(result) {
  if (!result) {
    return "Unexpected Shopify response.";
  }

  const errors = result.userErrors || [];

  return errors.length
    ? errors.map((item) => item.message).join("; ")
    : "No result returned.";
}

// --------------------------------------------------
// RESEND NOTIFICATION
// --------------------------------------------------

async function sendNotificationEmail(
  application,
  company,
  companyContact,
  env
) {
  if (
    !env.RESEND_API_KEY ||
    !env.WHOLESALE_NOTIFICATION_EMAIL ||
    !env.WHOLESALE_FROM_EMAIL
  ) {
    console.warn(
      "Wholesale notification skipped: Resend not configured."
    );
    return false;
  }

  const applicantName =
    `${clean(application.firstName)} ` +
    `${clean(application.lastName)}`;

  const billingAddress = application.billingSameAsShipping
    ? "Same as shipping address"
    : addressToText(application.billing);

  const resale = application.resaleIntent === "yes";

  // Do not include certificate contents,
  // R2 object keys, or registration numbers.
  const text = `
New Cadagnolo's Kitchen wholesale application

STATUS
PENDING APPROVAL

COMPANY
${clean(application.companyName)}

APPLICANT
${applicantName}

EMAIL
${clean(application.email)}

PHONE
${clean(application.phone)}

SHIPPING ADDRESS
${addressToText(application.shipping)}

BILLING ADDRESS
${billingAddress}

WHOLESALE TAX INFORMATION
Purchasing for resale: ${resale ? "Yes" : "No"}
Resale registration state: ${
  resale ? clean(application.resaleState) : "N/A"
}
Certificate: ${
  resale ? "Submitted - pending review" : "Not applicable"
}

SHOPIFY COMPANY ID
${company.id}

SHOPIFY COMPANY CONTACT ID
${companyContact.id}

The company and applicant have been created in Shopify.

The resale certificate (if applicable) is stored privately
in Cloudflare R2 and linked through Shopify company metafields.

No company-location B2B role has been assigned.
No tax exemption has been approved.

Review the application before granting wholesale
ordering permissions or tax-exempt status.
  `.trim();

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        from: env.WHOLESALE_FROM_EMAIL,
        to: [env.WHOLESALE_NOTIFICATION_EMAIL],
        subject:
          `Wholesale application pending approval: ` +
          clean(application.companyName),
        text,
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Resend notification failed:",
      response.status
    );
    return false;
  }

  return true;
}

// --------------------------------------------------
// ADDRESS HELPERS
// --------------------------------------------------

function buildAddress(address, applicant) {
  const result = {
    firstName: clean(applicant.firstName),
    lastName: clean(applicant.lastName),

    address1: clean(address.address1),
    city: clean(address.city),
    zoneCode: clean(address.zoneCode).toUpperCase(),
    zip: clean(address.zip),
    countryCode: clean(address.countryCode).toUpperCase(),

    phone: clean(applicant.phone),
  };

  if (clean(address.address2)) {
    result.address2 = clean(address.address2);
  }

  return result;
}

function addressToText(address) {
  if (!address) return "";

  return [
    clean(address.address1),
    clean(address.address2),

    [
      clean(address.city),
      clean(address.zoneCode).toUpperCase(),
      clean(address.zip),
    ].filter(Boolean).join(" "),

    clean(address.countryCode).toUpperCase(),
  ].filter(Boolean).join("\n");
}

// --------------------------------------------------
// APPLICATION VALIDATION
// --------------------------------------------------

function validateApplication(application) {
  if (
    !application ||
    typeof application !== "object" ||
    Array.isArray(application)
  ) {
    return "Invalid application.";
  }

  const requiredFields = [
    ["Company name", application.companyName],
    ["First name", application.firstName],
    ["Last name", application.lastName],
    ["Phone", application.phone],
    ["Email", application.email],

    ["Shipping street address", application.shipping?.address1],
    ["Shipping city", application.shipping?.city],
    ["Shipping state", application.shipping?.zoneCode],
    ["Shipping ZIP", application.shipping?.zip],
    ["Shipping country", application.shipping?.countryCode],
  ];

  if (application.billingSameAsShipping !== true &&
      application.billingSameAsShipping !== false) {
    return "Invalid billing address selection.";
  }

  if (!application.billingSameAsShipping) {
    requiredFields.push(
      ["Billing street address", application.billing?.address1],
      ["Billing city", application.billing?.city],
      ["Billing state", application.billing?.zoneCode],
      ["Billing ZIP", application.billing?.zip],
      ["Billing country", application.billing?.countryCode]
    );
  }

  const missing = requiredFields
    .filter(([, value]) => !clean(value))
    .map(([name]) => name);

  if (missing.length) {
    return "Please complete: " + missing.join(", ");
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      clean(application.email)
    )
  ) {
    return "Please enter a valid email address.";
  }

  if (clean(application.companyName).length > 200) {
    return "Company name is too long.";
  }

  if (
    clean(application.firstName).length > 100 ||
    clean(application.lastName).length > 100
  ) {
    return "Applicant name is too long.";
  }

  if (!["yes", "no"].includes(application.resaleIntent)) {
    return "Please specify whether the purchase is for resale.";
  }

  if (application.resaleIntent === "yes") {
    if (
      !/^[A-Za-z]{2}$/.test(
        clean(application.resaleState)
      )
    ) {
      return "Please enter a valid two-letter registration state.";
    }
  }

  const addresses = [application.shipping];

  if (!application.billingSameAsShipping) {
    addresses.push(application.billing);
  }

  for (const address of addresses) {
    if (
      !["US", "CA"].includes(
        clean(address.countryCode).toUpperCase()
      )
    ) {
      return "Invalid address country.";
    }
  }

  return null;
}

// --------------------------------------------------
// GENERAL HELPERS
// --------------------------------------------------

function clean(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function cleanShopDomain(value) {
  return clean(value)
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function jsonResponse(
  body,
  status = 200,
  additionalHeaders = {}
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Cache-Control": "no-store",
        ...additionalHeaders,
      },
    }
  );
}
