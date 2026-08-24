import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Collection from "./components/Collection";
import Contact from "./components/Contact";
import ProductPage from "./pages/ProductPage";
import Wholesale from "./pages/Wholesale";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Single page main site */}
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

        {/* Product detail page */}
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Wholesale landing/login portal */}
        <Route path="/wholesale" element={<Wholesale />} />
      </Routes>
    </Router>
  );
}