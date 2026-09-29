import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Collection from "./components/Collection";
import Contact from "./components/Contact";

import ProductPage from "./pages/ProductPage";
import Wholesale from "./pages/Wholesale";
import WholesaleApplication from "./pages/WholesaleApplication";
import NutritionFacts from "./pages/NutritionFacts";

import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <About />
              <Collection />
              <Contact />
            </>
          }
        />

        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductPage />
            </>
          }
        />

        <Route
          path="/nutrition"
          element={
            <>
              <Navbar />
              <NutritionFacts />
            </>
          }
        />

        <Route
          path="/wholesale"
          element={<Wholesale />}
        />

        <Route
          path="/wholesale-application"
          element={<WholesaleApplication />}
        />
      </Routes>
    </Router>
  );
}