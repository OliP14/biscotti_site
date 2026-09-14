import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArchedLogo from "./ArchedLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 36);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      return;
    }

    navigate(`/#${id}`);
  };

  return (
    <nav className={`site-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-shell">
        {/* Arched Logo */}
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="nav-brand"
          aria-label="Cadagnolo's Kitchen home"
          style={{
            width: "clamp(150px, 16vw, 210px)",
            padding: 0,
            margin: 0,
            border: "none",
            background: "transparent",
            flexShrink: 0,
            display: "block",
          }}
        >
          <ArchedLogo
            width="100%"
            color="#3f5140"
            showEst={true}
          />
        </button>

        {/* Desktop Navigation */}
        <div className="nav-links" aria-label="Primary navigation">
          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="nav-link"
          >
            Our Story
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("collection")}
            className="nav-link"
          >
            Biscotti
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="nav-link"
          >
            Contact
          </button>

          <Link to="/wholesale" className="nav-wholesale">
            Wholesale Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`mobile-menu-button ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen((current) => !current)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div id="mobile-navigation" className="mobile-nav-panel">
          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            Our Story
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("collection")}
          >
            Biscotti
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>

          <Link
            to="/wholesale"
            onClick={() => setMobileOpen(false)}
            className="mobile-wholesale"
          >
            Wholesale Login
          </Link>
        </div>
      )}
    </nav>
  );
}