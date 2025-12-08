import { useState, useEffect } from "react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="h-screen relative flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-linear-to-br from-amber-50 via-rose-50 to-orange-50"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      {/* Decorative Elements */}
      <div
        className="absolute top-20 right-20 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute bottom-20 left-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center px-6 max-w-4xl"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="inline-block" style={{ marginBottom: '1rem' }}>
          <div className="w-24 h-1 bg-rose-900 mx-auto rounded-full" style={{ marginBottom: '1rem' }}></div>
        </div>

        <h1 className="text-7xl font-serif text-rose-900 leading-tight"
        style={{ marginBottom: '1.5rem' }}>
          Cadagnolo's Kitchen
        </h1>

        <p className="text-2xl text-rose-800 font-light leading-relaxed"
        style={{ marginBottom: '2rem' }}>
          Handcrafted Italian biscotti, baked with love
          <br />
          using recipes passed down through generations
        </p>

        <button
          onClick={() =>
            document
              .getElementById("collection")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-rose-900 text-white px-10 py-4 rounded-full hover:bg-rose-800 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          style={{ minWidth: '260px', minHeight: '60px' }}
        >
          Explore Our Collection
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-rose-900 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-rose-900 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}