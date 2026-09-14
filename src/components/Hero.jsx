import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div
        className="hero-art"
        aria-hidden="true"
        style={{ transform: `translateY(${Math.min(scrollY * 0.06, 34)}px)` }}
      >
        <img
          src="/images/cadagnolo-watercolor-building.png"
          alt=""
        />
      </div>

      <div className="hero-content">
        <div
          className="hero-copy"
          style={{ transform: `translateY(${Math.min(scrollY * 0.025, 18)}px)` }}
        >
          <div className="hero-kicker">A Taste of Italy</div>

          <h1 className="hero-title">
            <span className="hero-title-top">CADAGNOLO'S</span>
            <span className="hero-title-bottom">KITCHEN</span>
          </h1>

          <p className="hero-description">
            Handcrafted Italian biscotti, baked with love using recipes passed
            down through generations.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              onClick={() =>
                document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })
              }
              className="primary-button"
            >
              Explore Our Collection
            </button>

            <Link to="/wholesale" className="secondary-button">
              Wholesale
            </Link>
          </div>

          {/* <div className="hero-est">Est. 2025</div> */}
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">Discover</div>
    </section>
  );
}
