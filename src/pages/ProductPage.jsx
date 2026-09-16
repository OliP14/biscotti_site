import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const productData = {
  1: {
    name: "Cranberry Chocolate",
    desc: "A perfect balance of tart and indulgent, our Chocolate-Covered Cranberry Biscotti begins with a crisp base generously studded with dried cranberries. Each cookie is then hand-dipped in velvety dark chocolate, adding a luxurious richness that melts into the bright cranberry sweetness. It's a harmonious blend of bold and fruity--an irresistible treat for anyone who loves a little extra decadence with their biscotti.",
    ingredients:
      "Bleached wheat flour (wheat flour, malted barley flour, niacin, iron, thiamin mononitrate, riboflavin, folic acid), dark chocolate flavored coating (cane sugar, vegetable oil [palm kernel oil, palm oil, glyceryl lacto esters], nonfat dry milk, cocoa processed with alkali, cocoa, soy lecithin, salt), sugar, eggs, butter (pasteurized cream, salt), dried cranberries (cranberries, sugar), olive oil. Contains: 2% or less of: baking powder (baking soda, cornstarch, sodium aluminum sulfate, calcium sulfate, monocalcium phosphate), anise seed, baking soda, salt, vanilla extract (vanilla bean extractives in water, alcohol). \nCONTAINS: WHEAT, MILK, EGG, SOY.",
    nutritionId: "cranberry-chocolate",
    options: [
      { value: "single", label: "Single Biscotti", price: "$2.99", img: "/images/chocolate_cran.jpg" },
      { value: "pack", label: "6-Pack", price: "$14.99", img: "/images/chocolate_cran_pack.jpg" },
    ],
  },
  2: {
    name: "Cranberry",
    desc: "Light, bright, and delightfully festive, our Cranberry Biscotti highlights the natural sweetness and gentle tartness of real dried cranberries. Baked to a golden crunch using our traditional family recipe, this biscotti is flavorful without being overly sweet--perfect for dipping into a morning cappuccino or enjoying as an afternoon pick-me-up. A simple, elegant flavor that tastes like home.",
    ingredients: 
      "Bleached wheat flour (wheat flour, malted barley flour, niacin, iron, thiamin mononitrate, riboflavin, folic acid), sugar, eggs, butter (pasteurized cream, salt), dried cranberries (cranberries, sugar), olive oil. Contains: 2% or less of: baking powder (baking soda, cornstarch, sodium aluminum sulfate, calcium sulfate, monocalcium phosphate), anise seed, baking soda, salt, vanilla extract (vanilla bean extractives in water, alcohol). \nCONTAINS: WHEAT, MILK, EGG.",
    nutritionId: "cranberry",
    options: [
      { value: "single", label: "Single Biscotti", price: "$2.49", img: "/images/cranberry.jpg" },
      { value: "pack", label: "6-Pack", price: "$12.99", img: "/images/cranberry_pack.jpg" },
    ],
  },
  3: {
    name: "Anise",
    desc: "A classic Italian favorite, our Anise Biscotti is delicately scented with the warm aromatic notes of anise seed. Each bite offers a subtle licorice sweetness and the comforting crunch of authentic, old-world biscotti. This timeless recipe has been passed down for generations and remains a beloved staple--perfect alongside espresso, wine, or enjoyed all on its own.",
    ingredients: "",
    nutritionId: "anise",
    options: [
      { value: "single", label: "Single Biscotti", price: "$2.49", img: "/images/anise.jpg" },
      { value: "pack", label: "6-Pack", price: "$12.99", img: "/images/anise_pack.jpg" },
    ],
  },
};

function ProductHeader() {
  return (
    <header className="subpage-header">
      <div className="subpage-header-shell">
        <Link to="/#collection" className="subpage-back">← Back to Biscotti</Link>
      </div>
    </header>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const product = productData[id];
  const [selectedOption, setSelectedOption] = useState(product?.options[0]?.value || "single");

  if (!product) {
    return (
      <main className="product-page">
        <ProductHeader />
        <div className="product-not-found">
          <div>
            <p className="brand-eyebrow">Cadagnolo's Kitchen</p>
            <h1 className="section-heading">Product Not Found</h1>
            <div style={{ marginTop: "2rem" }}>
              <Link to="/" className="primary-button">Return Home</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentOption = product.options.find((option) => option.value === selectedOption);

  return (
    <main className="product-page">
      <ProductHeader />

      <section className="product-detail-shell">
        <div
          className="product-detail-grid"
          style={{ alignItems: "start" }}
        >
          <div
            className="product-detail-image"
            style={{ alignSelf: "start" }}
          >
            <div className="product-image-wrap">
              <img
                src={currentOption.img}
                alt={`${product.name} - ${currentOption.label}`}
                key={currentOption.value}
              />
            </div>
          </div>

          <div className="product-detail-copy">
            <p className="brand-eyebrow">Handcrafted Italian Biscotti</p>
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="section-rule" />

            <p className="product-detail-description">{product.desc}</p>

            <details className="ingredients-dropdown">
              <summary className="ingredients-summary">
                Ingredients & Nutrition
              </summary>

              <div className="ingredients-content">
                <p className="ingredients-label">Ingredients:</p>

                <p className="ingredients-text">
                  {product.ingredients}
                </p>

                <Link
                  to={`/nutrition#${product.nutritionId}`}
                  className="nutrition-page-link"
                >
                  View Nutrition Facts →
                </Link>
              </div>
            </details>

            {/* <div className="product-option-field">
              <label htmlFor="size">Select Size</label>
              <select
                id="size"
                value={selectedOption}
                onChange={(event) => setSelectedOption(event.target.value)}
              >
                {product.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} — {option.price}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <div className="product-price-row">
              <div className="product-price">{currentOption.price}</div>
              <div className="product-unit">
                {selectedOption === "single" ? "per piece" : "per 6-pack"}
              </div>
            </div> */}

            {/* <button type="button" className="primary-button" style={{ width: "100%" }}>
              Add to Cart
            </button> */}

            <div className="product-values">
              Handcrafted · Family Recipe · Baked in Small Batches
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
