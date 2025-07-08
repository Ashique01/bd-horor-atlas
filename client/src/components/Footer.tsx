const Footer = () => (
  <footer className="bg-gradient-to-r from-gray-900 to-black bg-opacity-80 backdrop-blur-md p-6 text-center text-gray-400 text-sm border-t border-purple-700 mt-12">
    <div className="container mx-auto">
      <p className="mb-2">
        © {new Date().getFullYear()} ভূতের ঠিকানা। সর্বস্বত্ব সংরক্ষিত।
      </p>
      <p>
        ভালোবাসা সহ তৈরি <span className="text-red-500">💖</span>
      </p>
      <div className="flex justify-center space-x-4 mt-4">
        <a
          href="#"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          গোপনীয়তা নীতি
        </a>
        <span className="text-gray-600">|</span>
        <a
          href="#"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          ব্যবহারের শর্তাবলী
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
