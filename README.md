# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Cadagnolo's Kitchen — Wholesale Portal Update

This update adds a branded wholesale entry point to the existing React/Vite site.

New files

src/pages/Wholesale.jsx — public wholesale landing/login page at /wholesale

src/config/wholesale.js — central Orderspace portal URL configuration

.env.example — example environment variable for the Orderspace destination

Modified files

src/components/Navbar.jsx — adds Wholesale and Wholesale Login

src/App.jsx — adds the /wholesale route

Orderspace URL setup

The application reads:

VITE_WHOLESALE_PORTAL_URL

If that variable is not set, it defaults to:

https://wholesale.cadagnolo.com

While Orderspace is being configured, put its temporary URL in your local .env file, for example:

VITE_WHOLESALE_PORTAL_URL=https://cadagnolo.orderspace.com

When your custom Orderspace domain is ready, use:

VITE_WHOLESALE_PORTAL_URL=https://wholesale.cadagnolo.com

For Vite, restart the dev server after changing .env values.

Suggested DNS setup for production

Keep the public site at cadagnolo.com and configure wholesale.cadagnolo.com according to the custom-domain DNS instructions Orderspace provides for your account.

Wholesale email

The new page currently uses wholesale@cadagnolo.com for wholesale inquiries. Change that address in Wholesale.jsx if you plan to use a different inbox.