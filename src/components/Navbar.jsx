import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WHOLESALE_PORTAL_URL } from "../config/wholesale";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Keeps these links usable if Navbar is later shared with another route.
    navigate(`/#${id}`);
  };

  return (
    <nav
      className={`border-20 border-white fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-white shadow-lg border-t-10 border-b-10"
          : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 flex justify-between items-center gap-4 lg:gap-8">
        <h1
          onClick={() => scrollToSection("hero")}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-rose-900 cursor-pointer hover:text-rose-700 transition-colors duration-300 whitespace-nowrap"
        >
          Cadagnolo's Kitchen
        </h1>

        <div className="hidden md:flex items-center gap-5 lg:gap-8 text-rose-800 font-medium text-base lg:text-lg">
          <button
            onClick={() => scrollToSection("about")}
            className="nav-link hover:text-rose-900 transition-colors relative py-2 whitespace-nowrap"
          >
            Our Story
            <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-rose-900"></span>
          </button>

          <button
            onClick={() => scrollToSection("collection")}
            className="nav-link hover:text-rose-900 transition-colors relative py-2 whitespace-nowrap"
          >
            Biscotti
            <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-rose-900"></span>
          </button>

          <Link
            to="/wholesale"
            className="nav-link hover:text-rose-900 transition-colors relative py-2 whitespace-nowrap"
          >
            Wholesale
            <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-rose-900"></span>
          </Link>

          <button
            onClick={() => scrollToSection("contact")}
            className="nav-link hover:text-rose-900 transition-colors relative py-2 whitespace-nowrap"
          >
            Contact
            <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-rose-900"></span>
          </button>

          <a
            href={WHOLESALE_PORTAL_URL}
            className="bg-rose-900 text-white px-5 lg:px-6 py-3 rounded-full hover:bg-rose-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Wholesale Login
          </a>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <Link
            to="/wholesale"
            className="text-rose-900 font-medium text-sm whitespace-nowrap"
          >
            Wholesale
          </Link>
          <a
            href={WHOLESALE_PORTAL_URL}
            aria-label="Wholesale account login"
            className="bg-rose-900 text-white px-4 py-2.5 rounded-full text-sm font-medium shadow-md whitespace-nowrap"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}