import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Collection from "./components/Collection";
import Contact from "./components/Contact";
import ProductPage from "./pages/ProductPage";
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
      </Routes>
    </Router>
  );
}