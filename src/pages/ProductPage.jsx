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
      <div 
        className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50"
        style={{ paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-serif text-rose-900" style={{ marginBottom: '1rem' }}>
            Product Not Found
          </h1>
          <Link
            to="/"
            className="text-rose-800 hover:text-rose-900 transition-colors"
            style={{ textDecoration: 'underline' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-linear-to-br from-amber-50 via-rose-50 to-orange-50"
      style={{ paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', justifyContent: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: '1400px' }}>
        {/* Cleaner Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-rose-800 hover:text-rose-900 transition-all group bg-white rounded-full shadow-md hover:shadow-lg"
          style={{ padding: '0.75rem 1.5rem', marginBottom: '2rem' }}
        >
          <span className="transform group-hover:-translate-x-1 transition-transform" style={{ marginRight: '0.5rem' }}>
            ←
          </span>
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative" style={{ aspectRatio: '1/1', maxHeight: '600px' }}>
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 className="text-5xl font-serif text-rose-900" style={{ marginBottom: '1.5rem' }}>
                {product.name}
              </h1>

              <p className="text-rose-800 text-lg leading-relaxed" style={{ marginBottom: '2rem' }}>
                {product.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <p className="text-4xl font-bold text-rose-900">
                  {product.price}
                </p>
                <div className="text-rose-700 text-sm">per piece</div>
              </div>

              <button 
                className="bg-rose-900 text-white rounded-xl hover:bg-rose-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg font-medium"
                style={{ padding: '1rem 2rem', width: '100%' }}
              >
                Order Now
              </button>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ffe4e6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9f1239', flexWrap: 'wrap', justifyContent: 'center' }}>
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