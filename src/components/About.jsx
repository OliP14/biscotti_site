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
      style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', justifyContent: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ marginBottom: '4rem', textAlign: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <h2 className="text-5xl font-serif text-rose-900" style={{ marginBottom: '1rem' }}>
            Our Story
          </h2>
          <div className="w-24 h-1 bg-rose-900 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 items-center" style={{ gap: '4rem', marginBottom: '5rem', width: '100%', maxWidth: '1200px' }}>
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div style={{ maxWidth: '400px', width: '100%' }}>
              <img
                src="/images/cadagnolo.png"
                alt="Nonna Cadagnolo"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover' }}
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
              Nestled in the quiet Apennine mountains of northern Italy lies the small town
              of Cadagnolo. It's the kind of place where mornings start slow, neighbors greet
              each other by name, and conversations are never rushed.

              At the entrance of the town stands a simple sign marked with a violin—a symbol
              that has become part of Cadagnolo's identity. The violin represents the people who
              live there: storytellers at heart, known for speaking passionately, lingering in
              conversation, and letting words flow as freely as music. In many ways, the violin
              isn't just about talking—it's about connection. Just like music, conversation
              brings people together. It fills the sapce between meals, stretches time at the table,
              and turns simple gatherings into lasting memories.
            </p>
            <p className="text-rose-900 text-xl leading-relaxed">
              At Cadagnolo's Kitchen, we carry that spirit with us. We believe food should do more
              than nourish—it should invite people to slow down, to gather, and to stay a little longer.
              A biscotti shared over coffee isn't just a treat; it's an excuse to talk, to listen, and to
              enjoy the company around you.

              Our mission is simple: to create food that brings people together while preserving recipes
              that have been alive for generations, just like in Cadagnolo. Because the best moments
              in life aren't rushed—they're savored, one bite and one conversation at a time.
            </p>
            <div style={{ paddingTop: '1.5rem' }}></div>
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
              style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}