import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-pink-300 text-black py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/giving-back" className="hover:underline">
                  Giving Back
                </Link>
              </li>
              <li>
                <Link to="/employment" className="hover:underline">
                  Employment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Products & Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:underline">
                  Cupcakes
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:underline">
                  Cupcake Delivery
                </Link>
              </li>
              <li>
                <Link to="/corp-events" className="hover:underline">
                  Corp Events
                </Link>
              </li>
              <li>
                <Link to="/occasions" className="hover:underline">
                  Occasions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:underline">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
