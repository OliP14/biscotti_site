import { useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";


export default function Contact() {
  const formRef = useRef(null);

  const [state, handleSubmit] = useForm(
    import.meta.env.VITE_FORMSPREE_FORM_ID
  );

  useEffect(() => {
    if (state.succeeded) {
      formRef.current?.reset();
    }
  }, [state.succeeded]);

  return (
    <section
      id="contact"
      className="bg-linear-to-b from-amber-50/50 to-rose-50"
      style={{
        paddingTop: "8rem",
        paddingBottom: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="text-center"
          style={{
            marginBottom: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h2
            className="text-5xl font-serif text-rose-900"
            style={{ marginBottom: "1rem" }}
          >
            Contact Us
          </h2>

          <div
            className="w-24 h-1 bg-rose-900 rounded-full"
            style={{ marginBottom: "1.5rem" }}
          />

          <p className="text-rose-800 text-xl">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div style={{ width: "100%", maxWidth: "800px" }}>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl"
            style={{
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-rose-900 font-medium"
                style={{ marginBottom: "0.5rem" }}
              >
                Your Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Maria Rossi"
                className="w-full border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors"
                style={{ padding: "1rem" }}
                required
              />

              <ValidationError
                field="name"
                prefix="Name"
                errors={state.errors}
                className="text-red-600 text-sm mt-2"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-rose-900 font-medium"
                style={{ marginBottom: "0.5rem" }}
              >
                Your Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="maria@example.com"
                className="w-full border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors"
                style={{ padding: "1rem" }}
                required
              />

              <ValidationError
                field="email"
                prefix="Email"
                errors={state.errors}
                className="text-red-600 text-sm mt-2"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-rose-900 font-medium"
                style={{ marginBottom: "0.5rem" }}
              >
                Your Message
              </label>

              <textarea
                id="message"
                name="message"
                placeholder="Tell us what's on your mind..."
                rows="5"
                className="w-full border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors resize-none"
                style={{ padding: "1rem" }}
                required
              />

              <ValidationError
                field="message"
                prefix="Message"
                errors={state.errors}
                className="text-red-600 text-sm mt-2"
              />
            </div>

            <input
              type="hidden"
              name="subject"
              value="New message from Cadagnolo's Kitchen website"
            />

            <button
              type="submit"
              disabled={state.submitting}
              className="w-full bg-rose-900 text-white rounded-xl hover:bg-rose-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ padding: "1rem" }}
            >
              {state.submitting ? "Sending..." : "Send Message"}
            </button>

            {state.succeeded && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-center">
                <p className="font-semibold text-green-800">
                  Thank you for your message!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  We'll get back to you as soon as possible.
                </p>
              </div>
            )}

            {state.errors && !state.succeeded && (
              <ValidationError
                errors={state.errors}
                className="text-red-600 text-sm text-center"
              />
            )}
          </form>
        </div>

        <footer
          className="text-center text-rose-800"
          style={{ marginTop: "5rem" }}
        >
          <p className="text-sm">
            © {new Date().getFullYear()} Cadagnolo's Kitchen ~ Made with ❤️ by
            Nonna
          </p>
        </footer>
      </div>
    </section>
  );
}