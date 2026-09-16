import { Link } from "react-router-dom";

const nutritionProducts = [
  {
    id: "cranberry-chocolate",
    name: "Cranberry Chocolate",
    pdf: "/nutrition/cranberry-chocolate-nutrition.pdf",
  },
  {
    id: "cranberry",
    name: "Cranberry",
    pdf: "/nutrition/cranberry-nutrition.pdf",
  },
  {
    id: "anise",
    name: "Anise",
    pdf: "/nutrition/anise-nutrition.pdf",
  },
];

export default function NutritionFacts() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--cadagnolo-cream)",
        padding: "10rem 1.5rem 6rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginBottom: "2.5rem",
            color: "var(--cadagnolo-green-dark)",
            fontWeight: 600,
          }}
        >
          ← Back to Home
        </Link>

        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h1
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              color: "var(--cadagnolo-green-dark)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Nutrition Facts
          </h1>
        </div>

        {nutritionProducts.map((product) => (
          <section
            key={product.id}
            id={product.id}
            style={{
              marginBottom: "5rem",
              scrollMarginTop: "10rem",
            }}
          >
            <h2
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                color: "var(--cadagnolo-green-dark)",
                fontSize: "2rem",
                marginBottom: "1.25rem",
              }}
            >
              {product.name}
            </h2>

            <div
              style={{
                background: "white",
                border: "1px solid var(--cadagnolo-line)",
                padding: "1rem",
              }}
            >
              <iframe
                src={product.pdf}
                title={`${product.name} Nutrition Facts`}
                style={{
                  width: "100%",
                  height: "700px",
                  border: "none",
                }}
              />
            </div>

            <a
              href={product.pdf}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--cadagnolo-green-dark)",
                fontWeight: 600,
              }}
            >
              Open PDF →
            </a>
          </section>
        ))}
      </div>
    </main>
  );
}