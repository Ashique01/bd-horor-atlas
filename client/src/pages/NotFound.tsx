import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-5xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-xl mb-6">Oops! এই পাতাটি খুঁজে পাওয়া যায়নি।</p>
      <Link to="/" className="text-purple-400 hover:underline text-lg">
        🔙 হোমপেজে ফিরে যান
      </Link>
    </div>
  );
};

export default NotFound;
