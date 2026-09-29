import { useState } from "react";
import { Link } from "react-router-dom";

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
  taxId: "",

  shipping: { ...emptyAddress },

  billingSameAsShipping: true,

  billing: { ...emptyAddress },
};

export default function WholesaleApplication() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/wholesale-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "We couldn't submit your application. Please try again."
        );
      }

      setStatus("success");
      setFormData(initialForm);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "We couldn't submit your application. Please try again."
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

            <Link to="/wholesale" className="subpage-back">
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
              successfully. We'll review your information and contact
              you once your account has been approved.
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

          <Link to="/wholesale" className="subpage-back">
            ← Wholesale
          </Link>
        </div>
      </header>

      <section className="wholesale-application-section">
        <div className="wholesale-application-shell">
          <div className="wholesale-application-heading">
            <p className="brand-eyebrow">Wholesale Partners</p>

            <h1>Wholesale Application</h1>

            <div className="section-rule centered" />

            <p>
              Interested in carrying Cadagnolo's Kitchen?
              Complete the application below and we'll review your
              information for wholesale access.
            </p>
          </div>

          <form
            className="wholesale-application-form"
            onSubmit={handleSubmit}
          >
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

                <div className="wholesale-form-field full">
                  <label htmlFor="taxId">
                    Company Tax ID / EIN
                  </label>

                  <input
                    id="taxId"
                    name="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={updateField}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <AddressFields
              title="Shipping Address"
              type="shipping"
              address={formData.shipping}
              onChange={updateAddress}
            />

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
              Submitting an application does not automatically grant
              wholesale access. Applications are reviewed before
              wholesale ordering is enabled.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

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
          maxLength="3"
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