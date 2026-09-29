const SHOPIFY_API_VERSION = "2026-07";

/*
 * Creates the company + location only.
 *
 * IMPORTANT:
 * We intentionally DO NOT pass companyContact here.
 * That prevents Shopify from treating the initial contact
 * as part of the company creation/permission flow.
 */
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

/*
 * Creates the contact/customer AFTER the company exists.
 *
 * IMPORTANT:
 * This does NOT assign a company-location role.
 * Approval happens manually in Shopify later.
 */
const COMPANY_CONTACT_CREATE_MUTATION = `
  mutation CompanyContactCreate(
    $companyId: ID!,
    $input: CompanyContactInput!
  ) {
    companyContactCreate(
      companyId: $companyId,
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      url.pathname ===
      "/api/wholesale-application"
    ) {
      if (request.method !== "POST") {
        return jsonResponse(
          {
            error: "Method not allowed.",
          },
          405,
          {
            Allow: "POST",
          }
        );
      }

      return handleWholesaleApplication(
        request,
        env
      );
    }

    /*
     * Everything other than /api/* continues
     * to be served by the Vite static assets.
     */
    return env.ASSETS.fetch(request);
  },
};

/*
 * =========================================================
 * WHOLESALE APPLICATION
 * =========================================================
 */

async function handleWholesaleApplication(
  request,
  env
) {
  try {
    const requiredEnvironmentVariables = [
      "SHOPIFY_STORE_DOMAIN",
      "SHOPIFY_CLIENT_ID",
      "SHOPIFY_CLIENT_SECRET",
    ];

    const missingEnvironmentVariables =
      requiredEnvironmentVariables.filter(
        (name) => !env[name]
      );

    if (
      missingEnvironmentVariables.length > 0
    ) {
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
          error:
            "Invalid application data.",
        },
        400
      );
    }

    const validationError =
      validateApplication(application);

    if (validationError) {
      return jsonResponse(
        {
          error: validationError,
        },
        400
      );
    }

    /*
     * STEP 1
     *
     * Authenticate with Shopify.
     */
    const accessToken =
      await getShopifyAccessToken(env);

    /*
     * STEP 2
     *
     * Create the company + location.
     *
     * NO contact is created here.
     */
    const company =
      await createShopifyCompany(
        application,
        env,
        accessToken
      );

    /*
     * STEP 3
     *
     * Create the contact separately.
     *
     * We deliberately DO NOT assign any
     * company-location role.
     */
    const companyContact =
      await createShopifyCompanyContact(
        application,
        company.id,
        env,
        accessToken
      );

    /*
     * STEP 4
     *
     * Notify Cadagnolo's Kitchen that
     * an application is waiting for review.
     *
     * Email failure does NOT undo the
     * Shopify application.
     */
    let notificationSent = false;

    try {
      notificationSent =
        await sendNotificationEmail(
          application,
          company,
          companyContact,
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
          "Your wholesale application has been submitted and is pending approval.",

        notificationSent,
      },
      201
    );
  } catch (error) {
    console.error(
      "Wholesale application error:",
      error
    );

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
  const shopDomain =
    cleanShopDomain(
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
        grant_type:
          "client_credentials",

        client_id:
          env.SHOPIFY_CLIENT_ID,

        client_secret:
          env.SHOPIFY_CLIENT_SECRET,
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
    throw new Error(
      "Shopify did not return an access token."
    );
  }

  return data.access_token;
}

/*
 * =========================================================
 * CREATE SHOPIFY COMPANY + LOCATION
 * =========================================================
 */

async function createShopifyCompany(
  application,
  env,
  accessToken
) {
  const shopDomain =
    cleanShopDomain(
      env.SHOPIFY_STORE_DOMAIN
    );

  const shippingAddress =
    buildAddress(
      application.shipping,
      application
    );

  const companyLocation = {
    name:
      `${clean(
        application.companyName
      )} - Main`,

    phone:
      clean(application.phone),

    shippingAddress,

    billingSameAsShipping:
      Boolean(
        application.billingSameAsShipping
      ),

    taxRegistrationId:
      clean(application.taxId),

    note:
      "WHOLESALE APPLICATION STATUS: PENDING APPROVAL. " +
      "Do not grant B2B ordering permissions until this application has been reviewed.",
  };

  if (
    !application.billingSameAsShipping
  ) {
    companyLocation.billingAddress =
      buildAddress(
        application.billing,
        application
      );
  }

  /*
   * Notice that there is NO companyContact
   * property in this input.
   */
  const variables = {
    input: {
      company: {
        name:
          clean(
            application.companyName
          ),

        note:
          "WHOLESALE APPLICATION STATUS: PENDING APPROVAL\n" +
          "Submitted through cadagnolo.com.\n" +
          "Applicant has not yet been granted B2B location permissions.",
      },

      companyLocation,
    },
  };

  const data =
    await shopifyGraphQL(
      env,
      accessToken,
      COMPANY_CREATE_MUTATION,
      variables
    );

  const result =
    data.data?.companyCreate;

  if (!result) {
    throw new Error(
      "Shopify returned an unexpected companyCreate response."
    );
  }

  if (
    result.userErrors?.length
  ) {
    console.error(
      "Shopify companyCreate errors:",
      result.userErrors
    );

    throw new Error(
      result.userErrors
        .map(
          (error) =>
            error.message
        )
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

/*
 * =========================================================
 * CREATE CONTACT — WITHOUT B2B ROLE
 * =========================================================
 */

async function createShopifyCompanyContact(
  application,
  companyId,
  env,
  accessToken
) {
  const variables = {
    companyId,

    input: {
      firstName:
        clean(application.firstName),

      lastName:
        clean(application.lastName),

      email:
        clean(
          application.email
        ).toLowerCase(),

      phone:
        clean(application.phone),
    },
  };

  const data =
    await shopifyGraphQL(
      env,
      accessToken,
      COMPANY_CONTACT_CREATE_MUTATION,
      variables
    );

  const result =
    data.data?.companyContactCreate;

  if (!result) {
    throw new Error(
      "Shopify returned an unexpected companyContactCreate response."
    );
  }

  if (
    result.userErrors?.length
  ) {
    console.error(
      "Shopify companyContactCreate errors:",
      result.userErrors
    );

    throw new Error(
      result.userErrors
        .map(
          (error) =>
            error.message
        )
        .join("; ")
    );
  }

  if (!result.companyContact) {
    throw new Error(
      "Shopify did not create the company contact."
    );
  }

  return result.companyContact;
}

/*
 * =========================================================
 * SHOPIFY GRAPHQL HELPER
 * =========================================================
 */

async function shopifyGraphQL(
  env,
  accessToken,
  query,
  variables
) {
  const shopDomain =
    cleanShopDomain(
      env.SHOPIFY_STORE_DOMAIN
    );

  const response = await fetch(
    `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "X-Shopify-Access-Token":
          accessToken,
      },

      body: JSON.stringify({
        query,
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
        .map(
          (error) =>
            error.message
        )
        .join("; ")
    );
  }

  return data;
}

/*
 * =========================================================
 * RESEND ADMIN NOTIFICATION
 * =========================================================
 */

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
      "Wholesale email notification skipped because Resend is not configured."
    );

    return false;
  }

  const applicantName =
    `${clean(
      application.firstName
    )} ${clean(
      application.lastName
    )}`;

  const billingAddress =
    application.billingSameAsShipping
      ? "Same as shipping address"
      : addressToText(
          application.billing
        );

  /*
   * IMPORTANT:
   *
   * The Tax ID is intentionally NOT
   * included in this email.
   */
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

SHOPIFY COMPANY ID
${company.id}

SHOPIFY COMPANY CONTACT ID
${companyContact.id}

The company and applicant have been created in Shopify.

The applicant has NOT been granted a company-location B2B role by the Cadagnolo wholesale application.

Review the application in Shopify before granting wholesale ordering permissions.
  `.trim();

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${env.RESEND_API_KEY}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        from:
          env.WHOLESALE_FROM_EMAIL,

        to: [
          env.WHOLESALE_NOTIFICATION_EMAIL,
        ],

        subject:
          `Wholesale application pending approval: ${clean(
            application.companyName
          )}`,

        text,
      }),
    }
  );

  let responseBody = "";

  try {
    responseBody =
      await response.text();
  } catch {
    // Nothing else needed.
  }

  if (!response.ok) {
    console.error(
      "Resend error:",
      response.status,
      responseBody
    );

    return false;
  }

  console.log(
    "Wholesale notification email sent."
  );

  return true;
}

/*
 * =========================================================
 * ADDRESS
 * =========================================================
 */

function buildAddress(
  address,
  applicant
) {
  const result = {
    firstName:
      clean(applicant.firstName),

    lastName:
      clean(applicant.lastName),

    address1:
      clean(address.address1),

    city:
      clean(address.city),

    zoneCode:
      clean(
        address.zoneCode
      ).toUpperCase(),

    zip:
      clean(address.zip),

    countryCode:
      clean(
        address.countryCode
      ).toUpperCase(),

    phone:
      clean(applicant.phone),
  };

  if (
    clean(address.address2)
  ) {
    result.address2 =
      clean(address.address2);
  }

  return result;
}

/*
 * =========================================================
 * VALIDATION
 * =========================================================
 */

function validateApplication(
  application
) {
  if (
    !application ||
    typeof application !== "object"
  ) {
    return "Invalid application.";
  }

  const requiredFields = [
    [
      "Company name",
      application.companyName,
    ],

    [
      "First name",
      application.firstName,
    ],

    [
      "Last name",
      application.lastName,
    ],

    [
      "Phone",
      application.phone,
    ],

    [
      "Email",
      application.email,
    ],

    [
      "Company Tax ID",
      application.taxId,
    ],

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

  if (
    !application.billingSameAsShipping
  ) {
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

  const missingFields =
    requiredFields
      .filter(
        ([, value]) =>
          !clean(value)
      )
      .map(
        ([name]) => name
      );

  if (
    missingFields.length > 0
  ) {
    return (
      "Please complete the following fields: " +
      missingFields.join(", ")
    );
  }

  const email =
    clean(application.email);

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    return "Please enter a valid email address.";
  }

  if (
    clean(
      application.companyName
    ).length > 200
  ) {
    return "Company name is too long.";
  }

  if (
    clean(
      application.firstName
    ).length > 100 ||
    clean(
      application.lastName
    ).length > 100
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
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value.trim();
}

function cleanShopDomain(value) {
  return clean(value)
    .replace(
      /^https?:\/\//i,
      ""
    )
    .replace(
      /\/+$/,
      ""
    );
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

        "Cache-Control":
          "no-store",

        ...additionalHeaders,
      },
    }
  );
}