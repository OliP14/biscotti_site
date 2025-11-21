import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Cranberry Chocolate", img: "/images/chocolate_cran.jpg" },
  { id: 2, name: "Cranberry", img: "/images/cranberry.jpg" },
  { id: 3, name: "Anise", img: "/images/anise.jpg" },
];

export default function Collection() {
  return (
    <section id="collection" className="py-20 px-6 bg-white">
      <h2 className="text-4xl font-serif text-center text-rose-900 mb-10">
        Biscotti Collection
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="block bg-[#FFF8F0] rounded-xl shadow-md hover:shadow-lg transition p-4"
          >
            <img
              src={product.img}
              alt={product.name}
              className="rounded-lg mb-4"
            />
            <h3 className="text-xl text-rose-900 font-semibold text-center">
              {product.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}