export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-[#FFF8F0]">
      <h2 className="text-4xl font-serif text-center text-rose-900 mb-10">
        Our Story
      </h2>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src="/nonna.jpg"
          alt="Nonna Cadagnolo"
          className="rounded-xl shadow-md"
        />

        <div className="text-rose-900 text-lg">
          <p className="mb-4">
            Cadagnolo’s Kitchen began in a tiny Italian village where our Nonna
            perfected her biscotti recipe using simple, wholesome ingredients.
          </p>
          <p>
            Today, we continue her tradition by handcrafting every batch with
            the same love, care, and timeless Italian technique.
          </p>
        </div>
      </div>

      <img
        src="/images/chefs.jpg"
        alt="Chefs Baking"
        className="rounded-xl shadow-md mt-10 max-w-4xl mx-auto"
      />
    </section>
  );
}