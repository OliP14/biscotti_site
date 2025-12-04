import { useParams, Link } from "react-router-dom";

const productData = {
  1: {
    name: "Cranberry Chocolate",
    desc: "A perfect balance of tart and indulgent, our Chocolate-Covered Cranberry Biscotti begins with a crisp base generously studded with dried cranberries. Each cookie is then hand-dipped in velvety dark chocolate, adding a luxurious richness that melts into the bright cranberry sweetness. It's a harmonious blend of bold and fruity--an irresistible treat for anyone who loves a little extra decadence with their biscotti.",
    price: "$2.99",
    img: "/images/chocolate_cran.jpg",
  },
  2: {
    name: "Cranberry",
    desc: "Light, bright, and delightfully festive, our Cranberry Biscotti highlights the natural sweetness and gentle tartness of real dried cranberries. Baked to a golden crunch using our traditional family recipe, this biscotti is flavorful without being overly sweet--perfect for dipping into a morning cappuccino or enjoying as an afternoon pick-me-up. A simple, elegant flavor that tastes like home.",
    price: "$2.99",
    img: "/images/cranberry.jpg",
  },
  3: {
    name: "Anise",
    desc: "A classic Italian favorite, our Anise Biscotti is delicately scented with the warm aromatic notes of anise seed. Each bite offers a subtle licorice sweetness and the comforting crunch of authentic, old-world biscotti. This timeless recipe has been passed down for generations and remains a beloved staple--perfect alongside espresso, wine, or enjoyed all on its own.",
    price: "$2.99",
    img: "/images/anise.jpg",
  },
};

export default function ProductPage() {
  const { id } = useParams();
  const product = productData[id];

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-rose-900 mb-4">
            Product Not Found
          </h1>
          <Link
            to="/"
            className="text-rose-800 hover:text-rose-900 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-rose-800 hover:text-rose-900 mb-8 transition-colors group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square max-h-[600px]">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-12 flex flex-col justify-center">
              <h1 className="text-5xl font-serif text-rose-900 mb-6">
                {product.name}
              </h1>

              <p className="text-rose-800 text-lg leading-relaxed mb-8">
                {product.desc}
              </p>

              <div className="flex items-center justify-between mb-8">
                <p className="text-4xl font-bold text-rose-900">
                  {product.price}
                </p>
                <div className="text-rose-700 text-sm">per piece</div>
              </div>

              <button className="bg-rose-900 text-white py-4 px-8 rounded-xl hover:bg-rose-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg font-medium">
                Order Now
              </button>

              <div className="mt-8 pt-8 border-t border-rose-100">
                <div className="flex items-center gap-4 text-rose-700">
                  <span>✨ Handcrafted</span>
                  <span>•</span>
                  <span>🇮🇹 Italian Recipe</span>
                  <span>•</span>
                  <span>❤️ Made with Love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}