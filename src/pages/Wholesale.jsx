import { Link } from "react-router-dom";
import { WHOLESALE_PORTAL_URL } from "../config/wholesale";

const wholesaleBenefits = [
  {
    title: "Made for Independent Shops",
    description:
      "A simple ordering experience for coffee shops, specialty markets, gift shops, and other local retailers.",
  },
  {
    title: "Easy Reordering",
    description:
      "Sign in to your wholesale account to place orders and keep your favorite Cadagnolo's biscotti in stock.",
  },
  {
    title: "Your Account in One Place",
    description:
      "Use the Orderspace portal to manage wholesale orders and view the account information available to your business.",
  },
];

export default function Wholesale() {
  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-rose-50 to-orange-50 text-rose-900">
      <header className="w-full px-6 md:px-12 lg:px-20 xl:px-32 py-6 flex items-center justify-between gap-6 bg-white/90 backdrop-blur-md border-b border-rose-100">
        <Link
          to="/"
          className="font-serif text-2xl md:text-3xl text-rose-900 hover:text-rose-700 transition-colors"
        >
          Cadagnolo's Kitchen
        </Link>

        <Link
          to="/"
          className="text-sm md:text-base font-medium text-rose-800 hover:text-rose-900 transition-colors whitespace-nowrap"
        >
          ← Back to Main Site
        </Link>
      </header>

      <section className="px-6 py-20 md:py-28 flex justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center rounded-full bg-white border border-rose-100 px-4 py-2 text-sm font-semibold tracking-wide text-rose-800 shadow-sm mb-6">
              WHOLESALE PARTNERS
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-rose-900 mb-6">
              Biscotti your customers will come back for.
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-rose-800 max-w-2xl mb-9">
              Cadagnolo's Kitchen partners with coffee shops, specialty stores,
              and independent retailers who want handcrafted Italian biscotti on
              their shelves and counters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WHOLESALE_PORTAL_URL}
                className="inline-flex items-center justify-center bg-rose-900 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-rose-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Sign In to Wholesale Account
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </a>

              <a
                href="mailto:wholesale@cadagnolo.com?subject=Cadagnolo's%20Kitchen%20Wholesale%20Inquiry"
                className="inline-flex items-center justify-center bg-white text-rose-900 border-2 border-rose-200 px-8 py-4 rounded-full font-semibold text-lg shadow-sm hover:border-rose-300 hover:shadow-md transition-all"
              >
                Ask About Wholesale
              </a>
            </div>

            <p className="text-sm text-rose-700 mt-5">
              Wholesale ordering and account access are securely managed through
              our Orderspace portal.
            </p>
          </div>

          <aside className="bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
            <div className="bg-rose-900 text-white px-8 py-7">
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-rose-100 mb-2">
                Existing Wholesale Customer
              </p>
              <h2 className="font-serif text-3xl md:text-4xl">
                Welcome back.
              </h2>
            </div>

            <div className="p-8 md:p-10">
              <p className="text-rose-800 text-lg leading-relaxed mb-8">
                Continue to the Cadagnolo's Kitchen wholesale portal to place an
                order and access your wholesale account.
              </p>

              <a
                href={WHOLESALE_PORTAL_URL}
                className="w-full inline-flex items-center justify-center bg-rose-900 text-white rounded-xl px-6 py-4 text-lg font-semibold shadow-lg hover:bg-rose-800 transition-all"
              >
                Continue to Orderspace
              </a>

              <div className="mt-7 pt-7 border-t border-rose-100">
                <p className="text-sm text-rose-700 leading-relaxed">
                  Not a wholesale customer yet? Email us at{" "}
                  <a
                    href="mailto:wholesale@cadagnolo.com"
                    className="font-semibold underline underline-offset-4 hover:text-rose-900"
                  >
                    wholesale@cadagnolo.com
                  </a>{" "}
                  to start a conversation.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-24 flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-rose-900 mb-4">
              Built for Wholesale Partners
            </h2>
            <p className="text-lg text-rose-800 leading-relaxed">
              Your wholesale account gives your business a dedicated place to
              order Cadagnolo's Kitchen products and return whenever it's time to
              restock.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {wholesaleBenefits.map((benefit, index) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-rose-100 bg-linear-to-br from-white to-amber-50/60 p-7 shadow-sm"
              >
                <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center font-serif text-xl mb-5">
                  {index + 1}
                </div>
                <h3 className="font-serif text-2xl text-rose-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-rose-800 leading-relaxed">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-24 flex justify-center">
        <div className="w-full max-w-5xl bg-rose-900 text-white rounded-3xl px-8 py-12 md:px-14 md:py-14 text-center shadow-2xl">
          <p className="text-rose-100 font-semibold tracking-[0.16em] uppercase text-sm mb-3">
            Cadagnolo's Kitchen Wholesale
          </p>
          <h2 className="font-serif text-4xl md:text-5xl mb-5">
            Ready to restock?
          </h2>
          <p className="text-rose-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Sign in to your wholesale account and continue to Orderspace to place
            your next order.
          </p>
          <a
            href={WHOLESALE_PORTAL_URL}
            className="inline-flex items-center justify-center bg-white text-rose-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-rose-50 transition-colors"
          >
            Wholesale Account Login
          </a>
        </div>
      </section>

      <footer className="text-center text-rose-700 px-6 pb-10 text-sm">
        © {new Date().getFullYear()} Cadagnolo's Kitchen · cadagnolo.com
      </footer>
    </main>
  );
}
