import React from "react";
import { Link } from "react-router-dom";

interface Props {
  resetSelection: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Navbar: React.FC<Props> = ({
  resetSelection,
  isMobileMenuOpen,
  toggleMobileMenu,
}) => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black bg-opacity-80 backdrop-blur-md p-4 shadow-2xl fixed top-0 left-0 right-0 z-50 border-b border-purple-700">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Link to home */}
        <Link
          to="/"
          onClick={resetSelection}
          className="flex items-center text-3xl font-extrabold text-purple-400 hover:text-purple-300 transition-colors duration-300 tracking-wider group"
        >
          <span className="text-4xl mr-2 transform group-hover:rotate-12 transition-transform duration-300">
            👻
          </span>
          ভূতের ঠিকানা
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/about-us"
            onClick={resetSelection}
            className="text-gray-300 hover:text-white transition-all duration-300 relative group text-lg font-medium"
          >
            আমাদের সম্পর্কে
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/contact"
            onClick={resetSelection}
            className="text-gray-300 hover:text-white transition-all duration-300 relative group text-lg font-medium"
          >
            যোগাযোগ
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/submit-story"
            className="text-pink-500 hover:text-pink-400 font-semibold text-lg transition-colors duration-300 px-3 py-1 rounded-md border border-pink-500 hover:border-pink-400"
          >
            ➕ একটি গল্প জমা দিন
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        {/* Added a console.log for initial debugging, you can remove this later */}
        <button
          onClick={() => {
            console.log("Hamburger button clicked!"); // Debug log
            toggleMobileMenu();
          }}
          className="md:hidden text-white focus:outline-none relative w-8 h-6 flex flex-col justify-between"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"} // Accessibility
        >
          <span
            className={`block w-full h-0.5 bg-white transition-all duration-300 ease-out ${
              isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""
            }`}
          ></span>
          <span
            className={`block w-full h-0.5 bg-white transition-all duration-300 ease-out ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-full h-0.5 bg-white transition-all duration-300 ease-out ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-md transition-all duration-500 ease-in-out flex flex-col items-center py-6 border-t border-purple-800
          ${isMobileMenuOpen
            ? "max-h-screen opacity-100 visible" // Menu is open
            : "max-h-0 opacity-0 invisible" // Menu is closed
          }`}
        style={{ overflow: 'hidden' }} // Ensure content is clipped when max-height is 0
      >
        <Link
          to="/about-us"
          onClick={() => {
            toggleMobileMenu(); // Close menu after clicking
            resetSelection();
          }}
          className="block text-gray-300 hover:text-white text-xl py-3 w-full text-center transition-colors duration-300 hover:bg-purple-900/50 rounded-lg my-1"
        >
          আমাদের সম্পর্কে
        </Link>

        <Link
          to="/contact"
          onClick={() => {
            toggleMobileMenu(); // Close menu after clicking
            resetSelection();
          }}
          className="block text-gray-300 hover:text-white text-xl py-3 w-full text-center transition-colors duration-300 hover:bg-purple-900/50 rounded-lg my-1"
        >
          যোগাযোগ
        </Link>

        <Link
          to="/submit-story"
          onClick={() => {
            toggleMobileMenu(); // Close menu after clicking
          }}
          className="block text-pink-400 font-semibold text-xl py-3 w-full text-center transition-colors duration-300 hover:bg-pink-900/50 rounded-lg my-1 border border-pink-400"
        >
          ➕ একটি গল্প জমা দিন
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;