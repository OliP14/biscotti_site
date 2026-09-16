import { useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { Link } from "react-router-dom";

export default function Contact() {
  const formRef = useRef(null);
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_FORM_ID);

  useEffect(() => {
    if (state.succeeded) {
      formRef.current?.reset();
    }
  }, [state.succeeded]);

  return (
    <section id="contact" className="contact-section">
      <div className="contact-art" aria-hidden="true">
        <img src="/images/cadagnolo-watercolor-building-tall.png" alt="" />
      </div>

      <div className="section-shell contact-inner">
        <div className="contact-header">
          <p className="brand-eyebrow">Stay in Touch</p>
          <h2 className="section-heading">Contact Us</h2>
          <div className="section-rule" />
          <p className="contact-intro">
            We'd love to hear from you. Send us a message and we'll get back to you as soon as we can.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-grid">
            <div className="form-field">
              <label htmlFor="name">Your Name</label>
              <input id="name" type="text" name="name" placeholder="Maria Rossi" required />
              <ValidationError
                field="name"
                prefix="Name"
                errors={state.errors}
                className="form-error"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Your Email</label>
              <input id="email" type="email" name="email" placeholder="maria@example.com" required />
              <ValidationError
                field="email"
                prefix="Email"
                errors={state.errors}
                className="form-error"
              />
            </div>

            <div className="form-field full">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us what's on your mind..."
                rows="5"
                required
              />
              <ValidationError
                field="message"
                prefix="Message"
                errors={state.errors}
                className="form-error"
              />
            </div>
          </div>

          <input
            type="hidden"
            name="subject"
            value="New message from Cadagnolo's Kitchen website"
          />

          <div className="form-submit-row">
            <button type="submit" disabled={state.submitting} className="primary-button">
              {state.submitting ? "Sending..." : "Send Message"}
            </button>
          </div>

          {state.succeeded && (
            <div className="form-message success">
              Thank you for your message. We'll get back to you as soon as possible.
            </div>
          )}

          {state.errors && !state.succeeded && (
            <ValidationError errors={state.errors} className="form-error" />
          )}
        </form>
      </div>

      <footer className="site-footer">
        <div className="footer-shell">
          <div className="footer-brand">Cadagnolo's Kitchen · A Taste of Italy</div>
          <div className="footer-links">
            <Link to="/nutrition">
              Nutrition Facts
            </Link>
          </div>
          <div className="footer-meta">
            © {new Date().getFullYear()} Cadagnolo's Kitchen · Est. 2025
          </div>
        </div>
      </footer>
    </section>
  );
}
