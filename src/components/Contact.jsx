import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="bg-linear-to-b from-amber-50/50 to-rose-50"
      style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', justifyContent: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div 
          className="text-center" 
          style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <h2 className="text-5xl font-serif text-rose-900" style={{ marginBottom: '1rem' }}>
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-rose-900 rounded-full" style={{ marginBottom: '1.5rem' }}></div>
          <p className="text-rose-800 text-xl">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '800px' }}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl"
            style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div>
              <label className="block text-rose-900 font-medium" style={{ marginBottom: '0.5rem' }}>
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Maria Rossi"
                className="w-full border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors"
                style={{ padding: '1rem' }}
                required
              />
            </div>

            <div>
              <label className="block text-rose-900 font-medium" style={{ marginBottom: '0.5rem' }}>
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="maria@example.com"
                className="w-full border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors"
                style={{ padding: '1rem' }}
                required
              />
            </div>

            <div>
              <label className="block text-rose-900 font-medium" style={{ marginBottom: '0.5rem' }}>
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                rows="5"
                className="w-full border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors resize-none"
                style={{ padding: '1rem' }}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-900 text-white rounded-xl hover:bg-rose-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg font-medium"
              style={{ padding: '1rem' }}
            >
              Send Message
            </button>
          </form>
        </div>

        <footer className="text-center text-rose-800" style={{ marginTop: '5rem' }}>
          <p className="text-sm">
            © 2025 Cadagnolo's Kitchen ~  Made with ❤️ by Nonna
          </p>
        </footer>
      </div>
    </section>
  );
}