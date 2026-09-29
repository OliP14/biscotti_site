const SHOPIFY_API_VERSION = "2026-07";

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * Our API endpoint.
     */
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

    /*
     * Normally Cloudflare's asset routing handles everything
     * except /api/* before it reaches this Worker.
     *
     * This is a fallback in case another route reaches the Worker.
     */
    return env.ASSETS.fetch(request);
  },
};

async function handleWholesaleApplication(request, env) {
  try {
    const requiredEnvironmentVariables = [
      "SHOPIFY_STORE_DOMAIN",
      "SHOPIFY_CLIENT_ID",
      "SHOPIFY_CLIENT_SECRET",
    ];

    const missingEnvironmentVariables =
      requiredEnvironmentVariables.filter((name) => !env[name]);

    if (missingEnvironmentVariables.length > 0) {
      console.error(
        "Missing environment variables:",
        missingEnvironmentVariables
      );

      return jsonResponse(
        {
          error:
            "The wholesale application service is not configured correctly.",
        },
        500
      );
    }

    let application;

    try {
      application = await request.json();
    } catch {
      return jsonResponse(
        {
          error: "Invalid application data.",
        },
        400
      );
    }

    const validationError = validateApplication(application);

    if (validationError) {
      return jsonResponse(
        {
          error: validationError,
        },
        400
      );
    }

    /*
     * Obtain a temporary Shopify Admin API token.
     */
    const accessToken = await getShopifyAccessToken(env);

    /*
     * Create the Shopify B2B company.
     */
    const company = await createShopifyCompany(
      application,
      env,
      accessToken
    );

    /*
     * Email notification is optional.
     *
     * Shopify submission will still succeed if Resend
     * has not been configured or if the email fails.
     */
    let notificationSent = false;

    try {
      notificationSent = await sendNotificationEmail(
        application,
        company,
        env
      );
    } catch (error) {
      console.error(
        "Wholesale notification email failed:",
        error
      );
    }

    return jsonResponse(
      {
        success: true,
        message:
          "Your wholesale application has been submitted.",
        notificationSent,
      },
      201
    );
  } catch (error) {
    console.error("Wholesale application error:", error);

    return jsonResponse(
      {
        error:
          "We couldn't submit your wholesale application. Please try again or contact Cadagnolo's Kitchen.",
      },
      500
    );
  }
}

/*
 * =========================================================
 * SHOPIFY AUTHENTICATION
 * =========================================================
 */

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

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Shopify authentication returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    console.error(
      "Shopify authentication error:",
      response.status,
      data
    );

    throw new Error(
      data.error_description ||
        data.error ||
        "Shopify authentication failed."
    );
  }

  if (!data.access_token) {
    console.error(
      "Shopify authentication response:",
      data
    );

    throw new Error(
      "Shopify did not return an access token."
    );
  }

  return data.access_token;
}

/*
 * =========================================================
 * SHOPIFY COMPANY CREATION
 * =========================================================
 */

async function createShopifyCompany(
  application,
  env,
  accessToken
) {
  const shopDomain = cleanShopDomain(
    env.SHOPIFY_STORE_DOMAIN
  );

  const shippingAddress = buildAddress(
    application.shipping,
    application
  );

  const companyLocation = {
    name: `${clean(application.companyName)} - Main`,
    phone: clean(application.phone),
    shippingAddress,

    billingSameAsShipping: Boolean(
      application.billingSameAsShipping
    ),

    taxRegistrationId: clean(application.taxId),

    note:
      "WHOLESALE APPLICATION STATUS: PENDING APPROVAL. " +
      "Do not grant wholesale catalog or ordering access until reviewed.",
  };

  if (!application.billingSameAsShipping) {
    companyLocation.billingAddress = buildAddress(
      application.billing,
      application
    );
  }

  const variables = {
    input: {
      company: {
        name: clean(application.companyName),

        note:
          "WHOLESALE APPLICATION STATUS: PENDING APPROVAL\n" +
          "Submitted through cadagnolo.com wholesale application.",
      },

      companyContact: {
        firstName: clean(application.firstName),
        lastName: clean(application.lastName),

        email: clean(application.email).toLowerCase(),

        phone: clean(application.phone),
      },

      companyLocation,
    },
  };

  const response = await fetch(
    `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },

      body: JSON.stringify({
        query: COMPANY_CREATE_MUTATION,
        variables,
      }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Shopify returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    console.error(
      "Shopify HTTP error:",
      response.status,
      data
    );

    throw new Error(
      `Shopify request failed (${response.status}).`
    );
  }

  if (data.errors?.length) {
    console.error(
      "Shopify GraphQL errors:",
      data.errors
    );

    throw new Error(
      data.errors
        .map((error) => error.message)
        .join("; ")
    );
  }

  const result = data.data?.companyCreate;

  if (!result) {
    console.error(
      "Unexpected Shopify response:",
      data
    );

    throw new Error(
      "Shopify returned an unexpected response."
    );
  }

  if (result.userErrors?.length) {
    console.error(
      "Shopify companyCreate errors:",
      result.userErrors
    );

    throw new Error(
      result.userErrors
        .map((error) => error.message)
        .join("; ")
    );
  }

  if (!result.company) {
    throw new Error(
      "Shopify did not create the company."
    );
  }

  return result.company;
}

function buildAddress(address, applicant) {
  const result = {
    firstName: clean(applicant.firstName),
    lastName: clean(applicant.lastName),

    address1: clean(address.address1),

    city: clean(address.city),

    zoneCode: clean(address.zoneCode).toUpperCase(),

    zip: clean(address.zip),

    countryCode: clean(
      address.countryCode
    ).toUpperCase(),

    phone: clean(applicant.phone),
  };

  if (clean(address.address2)) {
    result.address2 = clean(address.address2);
  }

  return result;
}

/*
 * =========================================================
 * EMAIL NOTIFICATION
 * =========================================================
 */

async function sendNotificationEmail(
  application,
  company,
  env
) {
  if (
    !env.RESEND_API_KEY ||
    !env.WHOLESALE_NOTIFICATION_EMAIL ||
    !env.WHOLESALE_FROM_EMAIL
  ) {
    console.warn(
      "Wholesale email notification skipped because email environment variables are not configured."
    );

    return false;
  }

  const applicantName =
    `${clean(application.firstName)} ` +
    `${clean(application.lastName)}`;

  const billingAddress =
    application.billingSameAsShipping
      ? "Same as shipping address"
      : addressToText(application.billing);

  /*
   * Tax ID intentionally omitted from email.
   */
  const text = `
New Cadagnolo's Kitchen wholesale application

STATUS
Pending Approval

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

SHOPIFY COMPANY ID
${company.id}

The company, contact, location, and tax registration information have been submitted to Shopify.

This applicant has NOT been approved for wholesale ordering yet.

Review the company in Shopify before granting wholesale catalog or ordering access.
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

        to: [
          env.WHOLESALE_NOTIFICATION_EMAIL,
        ],

        subject:
          `New wholesale application: ${clean(
            application.companyName
          )}`,

        text,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Resend error:",
      response.status,
      errorText
    );

    return false;
  }

  return true;
}

/*
 * =========================================================
 * VALIDATION
 * =========================================================
 */

function validateApplication(application) {
  if (
    !application ||
    typeof application !== "object"
  ) {
    return "Invalid application.";
  }

  const requiredFields = [
    ["Company name", application.companyName],
    ["First name", application.firstName],
    ["Last name", application.lastName],
    ["Phone", application.phone],
    ["Email", application.email],
    ["Company Tax ID", application.taxId],

    [
      "Shipping street address",
      application.shipping?.address1,
    ],

    [
      "Shipping city",
      application.shipping?.city,
    ],

    [
      "Shipping state/province",
      application.shipping?.zoneCode,
    ],

    [
      "Shipping ZIP/postal code",
      application.shipping?.zip,
    ],

    [
      "Shipping country",
      application.shipping?.countryCode,
    ],
  ];

  if (!application.billingSameAsShipping) {
    requiredFields.push(
      [
        "Billing street address",
        application.billing?.address1,
      ],

      [
        "Billing city",
        application.billing?.city,
      ],

      [
        "Billing state/province",
        application.billing?.zoneCode,
      ],

      [
        "Billing ZIP/postal code",
        application.billing?.zip,
      ],

      [
        "Billing country",
        application.billing?.countryCode,
      ]
    );
  }

  const missingFields = requiredFields
    .filter(([, value]) => !clean(value))
    .map(([name]) => name);

  if (missingFields.length > 0) {
    return (
      "Please complete the following fields: " +
      missingFields.join(", ")
    );
  }

  const email = clean(application.email);

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return "Please enter a valid email address.";
  }

  if (
    clean(application.companyName).length > 200
  ) {
    return "Company name is too long.";
  }

  if (
    clean(application.firstName).length > 100 ||
    clean(application.lastName).length > 100
  ) {
    return "Applicant name is too long.";
  }

  return null;
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function clean(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function cleanShopDomain(value) {
  return clean(value)
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function addressToText(address) {
  if (!address) {
    return "";
  }

  return [
    clean(address.address1),

    clean(address.address2),

    [
      clean(address.city),

      clean(
        address.zoneCode
      ).toUpperCase(),

      clean(address.zip),
    ]
      .filter(Boolean)
      .join(" "),

    clean(
      address.countryCode
    ).toUpperCase(),
  ]
    .filter(Boolean)
    .join("\n");
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
        "Content-Type":
          "application/json; charset=UTF-8",

        "Cache-Control": "no-store",

        ...additionalHeaders,
      },
    }
  );
}