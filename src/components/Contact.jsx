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
      className="py-32 px-6 bg-gradient-to-b from-amber-50/50 to-rose-50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-rose-900 mb-4">Contact Us</h2>
          <div className="w-24 h-1 bg-rose-900 mx-auto rounded-full mb-6"></div>
          <p className="text-rose-800 text-xl">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div
          className="bg-white p-10 rounded-2xl shadow-2xl space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-rose-900 font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Maria Rossi"
              className="w-full p-4 border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-rose-900 font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="maria@example.com"
              className="w-full p-4 border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-rose-900 font-medium mb-2">
              Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what's on your mind..."
              rows="5"
              className="w-full p-4 border-2 border-rose-100 rounded-xl focus:border-rose-900 focus:outline-none transition-colors resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-rose-900 text-white p-4 rounded-xl hover:bg-rose-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg font-medium"
          >
            Send Message
          </button>
        </div>
      </div>

      <footer className="text-center mt-20 text-rose-800">
        <p className="text-sm">
          © 2024 Cadagnolo's Kitchen. Made with ❤️ in Italy.
        </p>
      </footer>
    </section>
  );
}