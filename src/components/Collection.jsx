import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Cranberry Chocolate", img: "/images/chocolate_cran.jpg" },
  { id: 2, name: "Cranberry", img: "/images/cranberry.jpg" },
  { id: 3, name: "Anise", img: "/images/anise.jpg" },
];

export default function Collection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );

    const element = document.getElementById("collection");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="collection" className="collection-section">
      <div className="section-shell">
        <div className="collection-header">
          <p className="brand-eyebrow">Handcrafted in Small Batches</p>
          <h2 className="section-heading">Biscotti Collection</h2>
          <div className="section-rule centered" />
          <p className="collection-intro">
            Each variety is crafted with authentic Italian tradition and carefully
            chosen ingredients, with a crisp texture made for coffee, conversation,
            and a little time at the table.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="product-card"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(26px)",
                transitionDelay: isVisible ? `${index * 110}ms` : "0ms",
              }}
            >
              <div className="product-image-wrap">
                <img src={product.img} alt={product.name} />
              </div>

              <div className="product-card-copy">
                <h3>{product.name}</h3>
                <div className="product-discover">Discover the flavor →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
