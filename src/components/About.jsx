import { useState, useEffect } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("about");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="bg-linear-to-b from-white to-amber-50/50"
      style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ marginBottom: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h2 className="text-5xl font-serif text-rose-900" style={{ marginBottom: '1rem' }}>
            Our Story
          </h2>
          <div className="w-24 h-1 bg-rose-900 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center" style={{ marginBottom: '5rem' }}>
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="w-full mx-auto" style={{ maxWidth: '400px' }}>
              <img
                src="/images/cadagnolo.png"
                alt="Nonna Cadagnolo"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                style={{ aspectRatio: '1/1', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <p className="text-rose-900 text-xl leading-relaxed">
              Cadagnolo's Kitchen began in a tiny Italian village where our
              Nonna perfected her biscotti recipe using simple, wholesome
              ingredients.
            </p>
            <p className="text-rose-800 text-lg leading-relaxed">
              Today, we continue her tradition by handcrafting every batch with
              the same love, care, and timeless Italian technique that has been
              passed down through our family for generations.
            </p>
            <div style={{ paddingTop: '1.5rem' }}>
              <div className="inline-block bg-rose-100 text-rose-900 px-6 py-3 rounded-full font-medium">
                Handcrafted with Love Since 1950
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full mx-auto" style={{ maxWidth: '800px' }}>
            <img
              src="/images/chefs.jpg"
              alt="Chefs Baking"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
              style={{ aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}