import { Link } from "react-router-dom";
import {
  WHOLESALE_PORTAL_URL,
  WHOLESALE_SIGNUP_URL,
} from "../config/wholesale";

const wholesaleBenefits = [
  {
    title: "Made for Independent Shops",
    description:
      "A simple ordering experience for coffee shops, specialty markets, gift shops, and other local retailers.",
  },
  {
    title: "Easy Reordering",
    description:
      "Approved wholesale partners can sign in to place orders and keep their favorite Cadagnolo's biscotti in stock.",
  },
  {
    title: "Your Account in One Place",
    description:
      "Use your Cadagnolo's Kitchen wholesale account to manage orders and your business purchasing.",
  },
];

export default function Wholesale() {
  return (
    <main className="wholesale-page">
      <header className="subpage-header">
        <div className="subpage-header-shell">
          <Link to="/" className="subpage-brand">
            Cadagnolo's Kitchen
          </Link>

          <Link to="/" className="subpage-back">
            ← Back to Main Site
          </Link>
        </div>
      </header>

      <section className="wholesale-hero">
        <div className="wholesale-hero-art" aria-hidden="true">
          <img
            src="/images/cadagnolo-watercolor-building.png"
            alt=""
          />
        </div>

        <div className="section-shell">
          <div className="wholesale-hero-copy">
            <p className="brand-eyebrow">Wholesale Partners</p>

            <h1 className="wholesale-title">
              Biscotti your customers will come back for.
            </h1>

            <div className="section-rule" />

            <p className="wholesale-lede">
              Cadagnolo's Kitchen partners with coffee shops,
              specialty stores, and independent retailers who want
              handcrafted Italian biscotti on their shelves and
              counters.
            </p>

            <div className="wholesale-actions">
              <a
                href={WHOLESALE_PORTAL_URL}
                className="primary-button"
              >
                Existing Customer Login →
              </a>

              <Link
                to={WHOLESALE_SIGNUP_URL}
                className="secondary-button"
              >
                New Customer Registration →
              </Link>
            </div>

            <p className="wholesale-note">
              Already an approved wholesale partner? Sign in to your
              account. New retailers can submit an application for
              wholesale access.
            </p>
          </div>
        </div>
      </section>

      <section className="wholesale-benefits">
        <div className="section-shell">
          <div className="wholesale-section-header">
            <p className="brand-eyebrow">
              Cadagnolo's Kitchen Wholesale
            </p>

            <h2 className="section-heading">
              Built for Wholesale Partners
            </h2>

            <div className="section-rule centered" />

            <p>
              Approved wholesale partners have a dedicated place to
              order Cadagnolo's Kitchen products whenever it's time
              to restock.
            </p>
          </div>

          <div className="wholesale-benefit-grid">
            {wholesaleBenefits.map((benefit, index) => (
              <article
                key={benefit.title}
                className="wholesale-benefit-card"
              >
                <div className="wholesale-benefit-number">
                  0{index + 1}
                </div>

                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wholesale-cta-section">
        <div className="section-shell">
          <div className="wholesale-cta">
            <p className="brand-eyebrow">A Taste of Italy</p>

            <h2>Ready to get started?</h2>

            <p>
              Existing partners can sign in to place their next
              order, while new retailers can apply for a
              Cadagnolo's Kitchen wholesale account.
            </p>

            <div className="wholesale-actions">
              <a
                href={WHOLESALE_PORTAL_URL}
                className="primary-button"
              >
                Wholesale Account Login
              </a>

              <Link
                to={WHOLESALE_SIGNUP_URL}
                className="secondary-button"
              >
                Apply for Wholesale
              </Link>
            </div>

            <p className="wholesale-help">
              Need help? Contact us at{" "}
              <a href="mailto:contact@cadagnolo.com">
                contact@cadagnolo.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <footer className="wholesale-footer">
        © {new Date().getFullYear()} Cadagnolo's Kitchen ·
        cadagnolo.com
      </footer>
    </main>
  );
}