export default function Hero() {
  return (
    <section
      id="hero"
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-center px-6"
      style={{
        backgroundImage: "url('/images/biscotti_bg.jpg')",
      }}
    >
      <div className="bg-white/70 p-8 rounded-xl shadow-lg max-w-2xl">
        <h1 className="text-5xl font-serif text-rose-900 mb-4">
          Cadagnolo's Kitchen
        </h1>
        <p className="text-lg text-rose-800">
          Handcrafted Italian biscotti, baked with love using recipes passed down
          through generations.
        </p>
      </div>
    </section>
  );
}