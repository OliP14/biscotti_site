export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-[#FFF8F0]">
      <h2 className="text-4xl font-serif text-center text-rose-900 mb-10">
        Contact Us
      </h2>

      <form className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md grid gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="p-3 border rounded"
        />
        <textarea
          placeholder="Your Message"
          rows="4"
          className="p-3 border rounded"
        ></textarea>

        <button
          type="submit"
          className="bg-rose-800 text-white p-3 rounded hover:bg-rose-900"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}