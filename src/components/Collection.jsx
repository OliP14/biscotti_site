import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Cranberry Chocolate", img: "/images/chocolate_cran.jpg" },
  { id: 2, name: "Cranberry", img: "/images/cranberry.jpg" },
  { id: 3, name: "Anise", img: "/images/anise.jpg" },
];

export default function Collection() {
  const [hoveredId, setHoveredId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    const element = document.getElementById("collection");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="collection" className="bg-white" style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="text-center" style={{ marginBottom: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <h2 className="text-5xl font-serif text-rose-900" style={{ marginBottom: '1rem' }}>
            Biscotti Collection
          </h2>
          <div className="w-24 h-1 bg-rose-900 mx-auto rounded-full" style={{ marginBottom: '1.5rem' }}></div>
          <p className="text-rose-800 text-xl" style={{ maxWidth: '48rem' }}>
            Each variety crafted with authentic Italian tradition and the finest
            ingredients
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '2.5rem', width: '100%', maxWidth: '1200px' }}>
          {products.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group block"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.img}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredId === product.id ? "scale-110" : "scale-100"
                    }`}
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className={`absolute inset-0 bg-rose-900/20 transition-opacity duration-500 ${
                      hoveredId === product.id ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                </div>

                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <h3 className="text-2xl text-rose-900 font-serif font-semibold" style={{ marginBottom: '0.5rem' }}>
                    {product.name}
                  </h3>
                  <div
                    className={`text-rose-700 transition-all duration-300 ${
                      hoveredId === product.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Discover More →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}