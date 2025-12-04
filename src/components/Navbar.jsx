import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "bg-white shadow-lg py-5" : "bg-white/95 backdrop-blur-md py-10"
      }`}
    >
      <div className="w-full px-16 md:px-24 lg:px-32 flex justify-between items-center">
        <h1
          onClick={() => scrollToSection("hero")}
          className="text-4xl font-serif text-rose-900 cursor-pointer hover:text-rose-700 transition-colors duration-300"
        >
          Cadagnolo's Kitchen
        </h1>

        <div className="flex gap-10 text-rose-800 font-medium text-lg">
          <button
            onClick={() => scrollToSection("about")}
            className="nav-link hover:text-rose-900 transition-colors relative py-2"
          >
            Our Story
            <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-rose-900"></span>
          </button>
          <button
            onClick={() => scrollToSection("collection")}
            className="nav-link hover:text-rose-900 transition-colors relative py-2"
          >
            Biscotti
            <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-rose-900"></span>
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="nav-link hover:text-rose-900 transition-colors relative py-2"
          >
            Contact
            <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-rose-900"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}