import React from "react";
import type { Division } from "../types/index"; // Assuming you move your types into a shared file like types.ts

interface Props {
  divisions: Division[];
  onSelect: (id: string) => void;
}

const DivisionSelector: React.FC<Props> = ({ divisions, onSelect }) => {
  return (
    <div className="text-center mb-16 animate-fade-in-down">
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-400 mb-6 drop-shadow-2xl leading-tight">
        ভূতের গল্প খুঁজছেন? <br /> জেলা ভিত্তিক ভৌতিক কাহিনী
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto opacity-90">
        বাংলাদেশের প্রতিটি জেলার গভীরের ভুতুড়ে ঘটনা, রহস্য এবং অজানা কাহিনী আবিষ্কার করুন।
      </p>
      <h2 className="text-3xl font-bold text-pink-400 mb-10 animate-pulse-slow">
        আপনার বিভাগ নির্বাচন করুন:
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {divisions.map((division) => (
          <button
            key={division.id}
            onClick={() => onSelect(division.id)}
            className="relative bg-gradient-to-br from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800
              p-8 rounded-2xl text-2xl font-bold shadow-2xl transition-all duration-500 transform hover:scale-105
              overflow-hidden group text-purple-100 hover:text-white border border-purple-700
              before:content-[''] before:absolute before:inset-0 before:bg-white before:opacity-0 before:mix-blend-overlay group-hover:before:opacity-5 transition-opacity duration-300"
          >
            <span className="relative z-10">{division.name}</span>
            <span className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="absolute -top-4 -right-4 text-5xl text-purple-300 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              👻
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DivisionSelector;
