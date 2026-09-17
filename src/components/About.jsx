import { useEffect, useState } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.16 }
    );

    const element = document.getElementById("about");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="section-shell">
        <div className="about-grid">
          <div
            className="about-art-wrap"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 800ms ease, transform 800ms ease",
            }}
          >
            <img
              src="/images/cadagnolo-watercolor-door.png"
              alt="Watercolor detail of a doorway and shutters in Cadagnolo"
            />
          </div>

          <div
            className="about-copy"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 800ms ease 120ms, transform 800ms ease 120ms",
            }}
          >
            <p className="brand-eyebrow">Our Story</p>
            <h2 className="section-heading">From a small village in the Apennines.</h2>
            <div className="section-rule" />

            <div className="about-body">
              <p>
                Nestled in the quiet Apennine Mountains of northern Italy lies the small town
                of Cadagnolo. It's the kind of place where mornings start slow, neighbors greet
                each other by name, and conversations are never rushed.
              </p>

              <p>
                At the entrance of the town stands a simple sign marked with a violin—a symbol
                that has become part of Cadagnolo's identity. The violin represents the people who
                live there: storytellers at heart, known for speaking passionately, lingering in
                conversation, and letting words flow as freely as music. In many ways, the violin
                isn't just about talking—it's about connection. Just like music, conversation
                brings people together. It fills the space between meals, stretches time at the table,
                and turns simple gatherings into lasting memories.
              </p>

              <p>
                At Cadagnolo's Kitchen, we carry that spirit with us. We believe food should do more
                than nourish—it should invite people to slow down, to gather, and to stay a little longer.
                A biscotti shared over coffee isn't just a treat; it's an excuse to talk, to listen, and to
                enjoy the company around you.
              </p>

              <p>
                Our mission is simple: to create food that brings people together while preserving recipes
                that have been alive for generations, just like in Cadagnolo. Because the best moments
                in life aren't rushed—they're savored, one bite and one conversation at a time.
              </p>
            </div>

            <div className="about-signoff">A Taste of Italy</div>
          </div>
        </div>

        <div className="about-photo-row">
          <div>
            <div className="about-family-photo">
              <img src="/images/chefs.jpg" alt="Chefs baking together" />
            </div>
            <p className="about-photo-caption">
              Made by hand, in small batches, with the same care that has carried the recipe through generations.
            </p>
          </div>

          <div className="about-pullquote">
            “Food should invite people to slow down, to gather, and to stay a little longer.”
          </div>
        </div>
      </div>
    </section>
  );
}
