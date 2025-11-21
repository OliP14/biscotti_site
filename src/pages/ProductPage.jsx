import { useParams, Link } from "react-router-dom";

const productData = {
  1: {
    name: "Cranberry Chocolate",
    desc: "A perfect balance of tart and indulgent, our Chocolate-Covered \
    Cranberry Biscotti begins with a crisp base generously studded \
    with dried cranberries. Each cookie is then hand-dipped in velvety dark chocolate, \
    adding a luxurious richness that melts into the bright cranberry sweetness. \
    It's a harmonious blend of bold and fruity--an irresistable treat for anyone who \
    loves a little extra decadence with their biscotti.",
    price: "$2.99",
    img: "/images/chocolate_cran.jpg",
  },
  2: {
    name: "Cranberry",
    desc: "Light, bright, and delightfully festive, our Cranberry Biscotti \
    highlights the natural sweetness and gentle tartness of real dried cranberries. \
    Baked to a golden crunch using our traditional family recipe, this biscotti is \
    flavorful without being overly sweet--perfect for dipping into a morning cappuccino \
    or enjoying as an afternoon pick-me-up. A simple, elegant flavor that tastes like home.",
    price: "$2.99",
    img: "/images/cranberry.jpg",
  },
  3: {
    name: "Anise",
    desc: "A classic Italian favorite, our Anise Biscotti is delicately scented with the warm \
    aromatic notes of anise seed. Each bite offers a subtle licorice sweetness and the \
    comforting crunch of authentic, old-world biscotti. This timeless recipe has been \
    passed down for generations and remains a beloved staple--perfect alongside espresso, \
    wine, or enjoyed all on its own.",
    price: "$2.99",
    img: "/images/anise.jpg",
  },
};

export default function ProductPage() {
  const { id } = useParams();
  const product = productData[id];

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6">
      <Link to="/" className="text-rose-800 underline">
        ← Back to Home
      </Link>

      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
        <img
          src={product.img}
          alt={product.name}
          className="rounded-lg mb-6"
        />

        <h1 className="text-4xl font-serif text-rose-900 mb-4">
          {product.name}
        </h1>
        <p className="text-rose-800 mb-4">{product.desc}</p>
        <p className="text-2xl font-bold text-rose-900 mb-6">
          {product.price}
        </p>

        <button className="bg-rose-800 text-white p-4 rounded hover:bg-rose-900">
          Order Now
        </button>
      </div>
    </div>
  );
}
