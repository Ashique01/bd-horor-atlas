// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cuteghost from "../assets/cuteghost.png";
// No longer importing spookyBg as we'll use CSS for background

interface Story {
  _id: string;
  division: string;
  district: string;
  // other fields can be here, but only these two are needed
}
// A flat map from district id to Bengali district name
const districtNameMap: Record<string, string> = {
  // Dhaka Division
  dhaka_city: "ঢাকা",
  gazipur: "গাজীপুর",
  narayanganj: "নারায়ণগঞ্জ",
  faridpur: "ফরিদপুর",
  kishoreganj: "কিশোরগঞ্জ",
  manikganj: "মানিকগঞ্জ",
  munshiganj: "মুন্সিগঞ্জ",
  narsingdi: "নরসিংদী",
  tangail: "টাঙ্গাইল",
  madaripur: "মাদারীপুর",
  gopalganj: "গোপালগঞ্জ",
  shariatpur: "শরীয়তপুর",
  rajbari: "রাজবাড়ী",

  // Chattogram Division
  ctg_city: "চট্টগ্রাম",
  coxsbazar: "কক্সবাজার",
  rangamati: "রাঙ্গামাটি",
  bandarban: "বান্দরবান",
  comilla: "কুমিল্লা",
  feni: "ফেনী",
  khagrachari: "খাগড়াছড়ি",
  noakhali: "নোয়াখালি",
  brahmanbaria: "ব্রাহ্মণবাড়িয়া",
  lakshmipur: "লক্ষ্মীপুর",
  chandpur: "চাঁদপুর",

  // Sylhet Division
  sylhet_dist: "সিলেট",
  moulvibazar: "মৌলভীবাজার",
  habiganj: "হবিগঞ্জ",
  sunamganj: "সুনামগঞ্জ",

  // Rajshahi Division
  rajshahi_city: "রাজশাহী",
  bogura: "বগুড়া",
  pabna: "পাবনা",
  natore: "নাটোর",
  sirajganj: "সিরাজগঞ্জ",
  joypurhat: "জয়পুরহাট",
  naogaon: "নওগাঁ",
  chapai_nawabganj: "চাঁপাইনবাবগঞ্জ",

  // Khulna Division
  khulna_city: "খুলনা",
  kushtia: "কুষ্টিয়া",
  jessore: "যশোর",
  satkhira: "সাতক্ষীরা",
  bagerhat: "বাগেরহাট",
  meherpur: "মেহেরপুর",
  chuadanga: "চুয়াডাঙ্গা",
  magura: "মাগুরা",
  narail: "নড়াইল",

  // Barisal Division
  barisal_city: "বরিশাল",
  patuakhali: "পটুয়াখালী",
  bhola: "ভোলা",
  jhalokati: "ঝালকাঠি",
  pirojpur: "পিরোজপুর",
  barguna: "বরগুনা",

  // Rangpur Division
  rangpur_city: "রংপুর",
  dinajpur: "দিনাজপুর",
  thakurgaon: "ঠাকুরগাঁও",
  lalmonirhat: "লালমনিরহাট",
  kurigram: "কুড়িগ্রাম",
  panchagarh: "পঞ্চাগড়",
  gaibandha: "গাইবান্ধা",

  // Mymensingh Division
  mymensingh_city: "ময়মনসিংহ",
  jamalpur: "জামালপুর",
  netrokona: "নেত্রকোণা",
  kishoreganj_mym: "কিশোরগঞ্জ", // Note: A duplicate 'Kishoreganj' might need disambiguation
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<string[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);

  useEffect(() => {
    // Fetch all stories to extract districts
    fetch(`${import.meta.env.VITE_API_URL}/api/stories?all=true`)
      .then((res) => res.json())
      .then((data: Story[]) => {
        const uniqueDistricts = Array.from(
          new Set(data.map((story) => story.district))
        ).sort();
        setDistricts(uniqueDistricts);
      })
      .catch((err) => {
        console.error("Failed to fetch stories for districts", err);
      })
      .finally(() => setLoadingDistricts(false));
  }, []);

  return (
    // Replaced image background with a deep, dark gradient and subtle pattern
    <div
      className="min-h-screen flex flex-col items-center text-white relative overflow-hidden
                 bg-gradient-to-br from-gray-950 to-black font-sans" // Deeper, more subtle gradient
    >
      {/* Subtle textured overlay - adds depth without a heavy image */}
      <div className="absolute inset-0 z-0 bg-repeat opacity-10"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M9 0H6v6l3-3V0zm3 3v3L9 6V3h3z'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Subtle Background Orbs (Enhanced) */}
      <div className="absolute top-1/4 left-1/12 w-48 h-48 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move z-0"></div>
      <div className="absolute bottom-1/4 right-1/12 w-40 h-40 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move delay-500 z-0"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-orb-move delay-1000 z-0"></div>

      {/* Main Content Area - Scrollable */}
      <div className="relative z-10 w-full flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 custom-scrollbar max-w-screen-xl">
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center py-16 px-6 sm:px-10 mb-16 text-center bg-gray-900/80 rounded-3xl shadow-3xl backdrop-blur-md border border-purple-800/50 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-500 ease-in-out">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-purple-400 mb-6 drop-shadow-xl animate-fade-in tracking-tighter leading-tight">
            👻 বাংলার ভৌতিক গল্প
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl mb-8 text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            বাংলার অজানা প্রান্তে ছড়িয়ে থাকা রহস্যময়, অশরীরী এবং ভয়ের গল্পগুলো এখন আপনার হাতের মুঠোয়।
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button
              onClick={() => navigate("/browse")}
              className="bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl uppercase tracking-wider glow-effect"
            >
              🧭 গল্পগুলো দেখুন
            </button>
            <button
              onClick={() => navigate("/submit-story")}
              className="bg-gradient-to-r from-pink-600 to-red-700 hover:from-pink-700 hover:to-red-800 px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl uppercase tracking-wider glow-effect"
            >
              ✍️ গল্প জমা দিন
            </button>
          </div>
          <img
            src={cuteghost}
            alt="ghost"
            className="w-40 sm:w-56 lg:w-72 mt-12 animate-updown drop-shadow-2xl opacity-90" // Increased size, adjusted opacity
          />
        </div>

        {/* Districts Info Section */}
        <section className="bg-gray-800/70 py-10 px-6 text-center rounded-2xl mx-4 max-w-4xl w-full mb-16 shadow-2xl border border-indigo-700/50">
          <h2 className="text-3xl sm:text-4xl font-semibold text-purple-300 mb-6">
            🏘️ গল্প পাওয়া যায় এই জেলাগুলোতে:
          </h2>
          {loadingDistricts ? (
            <p className="text-gray-400 text-lg animate-pulse">লোড হচ্ছে...</p>
          ) : districts.length === 0 ? (
            <p className="text-gray-400 text-lg">কোনো জেলা পাওয়া যায়নি।</p>
          ) : (
            <p className="text-gray-200 max-w-3xl mx-auto text-xl leading-relaxed font-light">
              {districts
                .map((districtId) => districtNameMap[districtId] || districtId)
                .join(" • ")}
            </p>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-gray-900/70 py-16 px-6 text-center rounded-2xl mx-4 max-w-6xl w-full mb-16 shadow-2xl border border-pink-700/50">
          <h2 className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-12">
            🧩 কেন আমাদের ব্যবহার করবেন?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureBox
              title="🧠 আসল গল্প"
              color="purple"
              text="বাস্তব অভিজ্ঞতা নির্ভর গল্পগুলি পাঠকদের হৃদয় স্পর্শ করে।"
            />
            <FeatureBox
              title="🗺️ লোকেশন ভিত্তিক খোঁজ"
              color="pink"
              text="বিভাগ ও জেলা অনুসারে গল্প খুঁজে পাওয়া যায় সহজেই।"
            />
            <FeatureBox
              title="🚀 লাইটওয়েট ও দ্রুত"
              color="green"
              text="স্মার্টফোনে সহজেই ব্রাউজ করা যায় দ্রুতগতিতে।"
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-800/70 py-16 px-6 text-center mb-16 rounded-2xl mx-4 max-w-6xl w-full shadow-2xl border border-purple-700/50">
          <h2 className="text-4xl sm:text-5xl font-bold text-pink-400 mb-12">
            ⚙️ কিভাবে ব্যবহার করবেন?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepBox
              step="1️⃣"
              title="বিভাগ বেছে নিন"
              text="যেকোনো বিভাগ থেকে শুরু করুন আপনার ভৌতিক যাত্রা।"
            />
            <StepBox
              step="2️⃣"
              title="জেলা নির্বাচন করুন"
              text="পছন্দের জেলার গা ছমছমে গল্প পড়ুন।"
            />
            <StepBox
              step="3️⃣"
              title="গল্প উপভোগ করুন"
              text="রহস্যময় কাহিনী পড়ুন ও শেয়ার করুন অন্যদের সঙ্গে।"
            />
          </div>
        </section>

        {/* Call to action for submitting stories, repeated at bottom for emphasis */}
        <div className="flex flex-col items-center py-12 px-6 text-center bg-gray-900/80 rounded-3xl shadow-3xl backdrop-blur-sm border border-purple-600/50 max-w-3xl w-full mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-6">
            আপনার গা ছমছমে গল্প আছে?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
            আমাদের সাথে আপনার বাস্তব ভৌতিক অভিজ্ঞতা শেয়ার করুন!
          </p>
          <button
            onClick={() => navigate("/submit-story")}
            className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl uppercase tracking-wider glow-effect"
          >
            ✍️ এখনি জমা দিন
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable FeatureBox component
const FeatureBox = ({
  title,
  text,
  color,
}: {
  title: string;
  text: string;
  color: string;
}) => (
  <div className="bg-gray-800/80 p-8 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-purple-600 relative overflow-hidden">
    <div className={`absolute inset-0 opacity-10 ${
        color === "purple" ? "bg-purple-500" :
        color === "pink" ? "bg-pink-500" :
        color === "green" ? "bg-green-500" : ""
    } blur-lg`}></div> {/* Subtle background color glow */}
    <h3
      className={`text-2xl font-bold mb-3 relative z-10 ${
        color === "purple"
          ? "text-purple-300"
          : color === "pink"
          ? "text-pink-300"
          : color === "green"
          ? "text-green-300"
          : "text-gray-300"
      }`}
    >
      {title}
    </h3>
    <p className="text-gray-400 text-base relative z-10">{text}</p>
  </div>
);

// Reusable StepBox component
const StepBox = ({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) => (
  <div className="bg-gray-800/80 p-8 rounded-2xl shadow-xl border border-gray-700 hover:border-indigo-600 transition-all duration-300">
    <h3 className="text-2xl font-semibold text-indigo-300 mb-3">
      {step} {title}
    </h3>
    <p className="text-gray-400 text-base">{text}</p>
  </div>
);

export default HomePage;