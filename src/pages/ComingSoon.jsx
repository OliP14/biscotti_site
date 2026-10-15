
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <main className="product-page">
      <header className="subpage-header">
        <div className="subpage-header-shell">
          <Link to="/#collection" className="subpage-back">
            ← Back to Biscotti
          </Link>
        </div>
      </header>

      <section className="coming-soon-page">
        <div className="coming-soon-story paper-panel">
          <p className="brand-eyebrow">
            From Our Kitchen to Yours
          </p>

          <h1 className="section-heading">
            Something Wonderful Is in the Making
          </h1>

          <div className="section-rule centered" />

          <div className="coming-soon-story-body">
            <p>
              At Cadagnolo's Kitchen, every biscotti
              begins with a commitment to quality,
              tradition, and the simple joy of creating
              something worth sharing.
            </p>

            <p>
              We're constantly exploring new flavors,
              carefully sourcing the finest ingredients,
              and refining our recipes until every bite
              reflects the care and craftsmanship behind
              our family tradition.
            </p>

            <p>
              We believe great biscotti can't be rushed.
              Some ideas take time, a little experimentation,
              and plenty of tasting before they're ready
              to join our collection.
            </p>

            <p>
              Our kitchen is always creating, and we look
              forward to sharing what's next.
            </p>
          </div>

          <Link to="/#collection" className="primary-button">
            Explore Our Biscotti
          </Link>
        </div>
      </section>
    </main>
  );
}
