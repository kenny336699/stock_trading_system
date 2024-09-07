import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo1 from "../assets/logo1.png";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`bg-pink-300 p-4 transition-all duration-300 ${
        isSticky ? "sticky top-0 z-50 shadow-md" : ""
      }`}
    >
      <div className="w-full px-40 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo1} alt="Toronto Cupcake" className="w-12 h-12" />
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-black hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-black hover:text-gray-700">
                  Cupcake
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-black hover:text-gray-700">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-black hover:text-gray-700">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-black hover:text-gray-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <Link to="/cart">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
