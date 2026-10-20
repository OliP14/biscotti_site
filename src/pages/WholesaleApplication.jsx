
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const MAX_PDF_SIZE = 5 * 1024 * 1024;

const emptyAddress = {
  address1: "",
  address2: "",
  city: "",
  zoneCode: "",
  zip: "",
  countryCode: "US",
};

const initialForm = {
  companyName: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",

  shipping: { ...emptyAddress },

  billingSameAsShipping: true,
  billing: { ...emptyAddress },

  resaleIntent: "yes",
  resaleState: "IL",
};

export default function WholesaleApplication() {
  const [formData, setFormData] = useState(initialForm);
  const [resaleCertificate, setResaleCertificate] =
    useState(null);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateAddress = (type, event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [type]: {
        ...current[type],
        [name]: value,
      },
    }));
  };

  const handleSameAddress = (event) => {
    setFormData((current) => ({
      ...current,
      billingSameAsShipping: event.target.checked,
    }));
  };

  const handleResaleIntent = (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      resaleIntent: value,
    }));

    if (value === "no") {
      removeCertificate();
    }
  };

  const removeCertificate = () => {
    setResaleCertificate(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectCertificate = (file) => {
    setError("");

    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF document.");
      removeCertificate();
      return;
    }

    if (file.size === 0 || file.size > MAX_PDF_SIZE) {
      setError(
        "The document must be a PDF no larger than 5 MB."
      );
      removeCertificate();
      return;
    }

    setResaleCertificate(file);
  };

  const handleFileChange = (event) => {
    selectCertificate(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (status === "submitting") return;

    const file = event.dataTransfer.files?.[0];

    selectCertificate(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "submitting") return;

    setError("");

    if (
      formData.resaleIntent === "yes" &&
      !resaleCertificate
    ) {
      setError(
        "Please upload your completed resale certificate."
      );
      return;
    }

    setStatus("submitting");

    try {
      const payload = new FormData();

      payload.append(
        "application",
        JSON.stringify(formData)
      );

      if (
        formData.resaleIntent === "yes" &&
        resaleCertificate
      ) {
        payload.append(
          "resaleCertificate",
          resaleCertificate,
          resaleCertificate.name
        );
      }

      const response = await fetch(
        "/api/wholesale-application",
        {
          method: "POST",
          body: payload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "We couldn't submit your application."
        );
      }

      setStatus("success");
      setFormData(initialForm);
      removeCertificate();

    } catch (err) {
      console.error("Wholesale application failed:", err);

      setError(
        err.message ||
        "We couldn't submit your application."
      );

      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="wholesale-page">
        <header className="subpage-header">
          <div className="subpage-header-shell">
            <Link to="/" className="subpage-brand">
              Cadagnolo's Kitchen
            </Link>

            <Link
              to="/wholesale"
              className="subpage-back"
            >
              ← Wholesale
            </Link>
          </div>
        </header>

        <section className="wholesale-application-section">
          <div className="wholesale-application-success">
            <p className="brand-eyebrow">
              Application Received
            </p>

            <h1>Thank you for your interest.</h1>

            <div className="section-rule centered" />

            <p>
              Your wholesale application has been submitted
              successfully. We'll review your information
              and contact you once your account has been
              approved.
            </p>

            <Link to="/" className="primary-button">
              Return to Main Site
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="wholesale-page">
      <header className="subpage-header">
        <div className="subpage-header-shell">
          <Link to="/" className="subpage-brand">
            Cadagnolo's Kitchen
          </Link>

          <Link
            to="/wholesale"
            className="subpage-back"
          >
            ← Wholesale
          </Link>
        </div>
      </header>

      <section className="wholesale-application-section">
        <div className="wholesale-application-shell">

          <div className="wholesale-application-heading">
            <p className="brand-eyebrow">
              Wholesale Partners
            </p>

            <h1>Wholesale Application</h1>

            <div className="section-rule centered" />

            <p>
              Interested in carrying Cadagnolo's Kitchen?
              Complete the application below and we'll
              review your information for wholesale access.
            </p>
          </div>

          <form
            className="wholesale-application-form"
            onSubmit={handleSubmit}
          >

            {/* BUSINESS INFORMATION */}
            <fieldset>
              <legend>Business Information</legend>

              <div className="wholesale-form-grid">
                <div className="wholesale-form-field full">
                  <label htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="wholesale-form-field">
                  <label htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="wholesale-form-field">
                  <label htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="wholesale-form-field">
                  <label htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="wholesale-form-field">
                  <label htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={updateField}
                    required
                  />
                </div>
              </div>
            </fieldset>

            {/* SHIPPING */}
            <AddressFields
              title="Shipping Address"
              type="shipping"
              address={formData.shipping}
              onChange={updateAddress}
            />

            {/* BILLING */}
            <fieldset>
              <legend>Billing Address</legend>

              <label className="wholesale-checkbox">
                <input
                  type="checkbox"
                  checked={formData.billingSameAsShipping}
                  onChange={handleSameAddress}
                />
                <span>
                  Billing address is the same as shipping
                </span>
              </label>

              {!formData.billingSameAsShipping && (
                <AddressInputs
                  type="billing"
                  address={formData.billing}
                  onChange={updateAddress}
                />
              )}
            </fieldset>

            {/* TAX DOCUMENTATION */}
            <fieldset className="wholesale-tax-fieldset">
              <legend>Wholesale Tax Information</legend>

              <p className="wholesale-tax-intro">
                To request tax-exempt purchasing, please
                provide documentation confirming your
                products are purchased for resale.
              </p>

              <div className="wholesale-form-grid">
                <div className="wholesale-form-field full">
                  <label htmlFor="resaleIntent">
                    Are you purchasing our products for resale?
                  </label>

                  <select
                    id="resaleIntent"
                    name="resaleIntent"
                    value={formData.resaleIntent}
                    onChange={handleResaleIntent}
                    required
                  >
                    <option value="yes">
                      Yes, for resale to customers
                    </option>

                    <option value="no">
                      No, for business use or consumption
                    </option>
                  </select>
                </div>

                {formData.resaleIntent === "yes" && (
                  <>
                    <div className="wholesale-form-field full">
                      <label htmlFor="resaleState">
                        State of Resale Registration
                      </label>

                      <input
                        id="resaleState"
                        name="resaleState"
                        type="text"
                        maxLength={2}
                        placeholder="IL"
                        value={formData.resaleState}
                        onChange={updateField}
                        required
                      />
                    </div>

                    <div className="wholesale-form-field full">
                      <div className="wholesale-upload-heading">
                        <label htmlFor="resaleCertificate">
                          Resale Certificate
                        </label>

                        <a
                          href="https://tax.illinois.gov/content/dam/soi/en/web/tax/forms/sales/documents/sales/crt-61.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Illinois CRT-61 ↗
                        </a>
                      </div>

                      <input
                        ref={fileInputRef}
                        id="resaleCertificate"
                        name="resaleCertificate"
                        className="wholesale-file-input"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        aria-describedby="certificate-help"
                      />

                      <div
                        className={
                          `wholesale-upload-zone ${
                            isDragging ? "is-dragging" : ""
                          } ${
                            resaleCertificate ? "has-file" : ""
                          }`
                        }
                        onDragOver={(event) => {
                          event.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={(event) => {
                          event.preventDefault();
                          setIsDragging(false);
                        }}
                        onDrop={handleDrop}
                      >
                        {resaleCertificate ? (
                          <div className="wholesale-upload-selected">
                            <span className="wholesale-upload-file-icon">
                              PDF
                            </span>

                            <div className="wholesale-upload-file-details">
                              <strong>
                                {resaleCertificate.name}
                              </strong>
                              <span>
                                {(
                                  resaleCertificate.size /
                                  (1024 * 1024)
                                ).toFixed(2)} MB
                              </span>
                            </div>

                            <button
                              type="button"
                              className="wholesale-upload-remove"
                              onClick={removeCertificate}
                              disabled={status === "submitting"}
                              aria-label="Remove uploaded certificate"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="resaleCertificate"
                            className="wholesale-upload-prompt"
                          >
                            <span className="wholesale-upload-icon">
                              ↑
                            </span>

                            <strong>
                              Choose a PDF to upload
                            </strong>

                            <span>
                              Or drag and drop your file here
                            </span>

                            <small>
                              Completed and signed certificate
                              · Maximum 5 MB
                            </small>
                          </label>
                        )}
                      </div>

                      <small id="certificate-help">
                        Illinois businesses should complete
                        Form CRT-61. Other businesses should
                        upload their applicable resale certificate.
                      </small>
                    </div>
                  </>
                )}
              </div>

              <div className="wholesale-tax-notice">
                <p>
                  Your documents are stored privately.
                  Tax-exempt purchasing privileges are
                  subject to verification and approval.
                </p>
              </div>
            </fieldset>

            {error && (
              <div
                className="wholesale-form-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button wholesale-submit"
              disabled={status === "submitting"}
            >
              {status === "submitting"
                ? "Submitting Application..."
                : "Submit Wholesale Application"}
            </button>

            <p className="wholesale-form-disclaimer">
              Wholesale access is granted after your
              application has been reviewed and approved.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

// --------------------------------------------------
// ADDRESS COMPONENTS
// --------------------------------------------------

function AddressFields({
  title,
  type,
  address,
  onChange,
}) {
  return (
    <fieldset>
      <legend>{title}</legend>
      <AddressInputs
        type={type}
        address={address}
        onChange={onChange}
      />
    </fieldset>
  );
}

function AddressInputs({
  type,
  address,
  onChange,
}) {
  return (
    <div className="wholesale-form-grid">

      <div className="wholesale-form-field full">
        <label htmlFor={`${type}-address1`}>
          Street Address
        </label>

        <input
          id={`${type}-address1`}
          name="address1"
          type="text"
          value={address.address1}
          onChange={(event) => onChange(type, event)}
          required
        />
      </div>

      <div className="wholesale-form-field full">
        <label htmlFor={`${type}-address2`}>
          Suite / Unit / Building
          <span className="optional"> Optional</span>
        </label>

        <input
          id={`${type}-address2`}
          name="address2"
          type="text"
          value={address.address2}
          onChange={(event) => onChange(type, event)}
        />
      </div>

      <div className="wholesale-form-field">
        <label htmlFor={`${type}-city`}>
          City
        </label>

        <input
          id={`${type}-city`}
          name="city"
          type="text"
          value={address.city}
          onChange={(event) => onChange(type, event)}
          required
        />
      </div>

      <div className="wholesale-form-field">
        <label htmlFor={`${type}-zoneCode`}>
          State / Province Code
        </label>

        <input
          id={`${type}-zoneCode`}
          name="zoneCode"
          type="text"
          placeholder="IL"
          maxLength={3}
          value={address.zoneCode}
          onChange={(event) => onChange(type, event)}
          required
        />
      </div>

      <div className="wholesale-form-field">
        <label htmlFor={`${type}-zip`}>
          ZIP / Postal Code
        </label>

        <input
          id={`${type}-zip`}
          name="zip"
          type="text"
          value={address.zip}
          onChange={(event) => onChange(type, event)}
          required
        />
      </div>

      <div className="wholesale-form-field">
        <label htmlFor={`${type}-countryCode`}>
          Country
        </label>

        <select
          id={`${type}-countryCode`}
          name="countryCode"
          value={address.countryCode}
          onChange={(event) => onChange(type, event)}
          required
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
        </select>
      </div>

    </div>
  );
}
