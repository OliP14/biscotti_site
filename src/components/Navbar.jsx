export default function Navbar() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#F7F3E8]/90 backdrop-blur-md shadow-sm z-50 p-4 flex justify-between items-center">
      <h1
        onClick={() => scrollToSection("hero")}
        className="text-3xl font-serif text-rose-900 cursor-pointer"
      >
        Cadagnolo's Kitchen
      </h1>

      <div className="flex gap-6 text-[#F7F3E8] font-serif">
        <button onClick={() => scrollToSection("about")}>Our Story</button>
        <button onClick={() => scrollToSection("collection")}>Biscotti</button>
        <button onClick={() => scrollToSection("contact")}>Contact</button>
      </div>
    </nav>
  );
}