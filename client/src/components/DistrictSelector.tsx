// src/components/DistrictSelector.tsx
import React, { useEffect, useState } from "react";

interface District {
  name: string;
  hasStories: boolean;
}

interface Props {
  division: string;
  onSelectDistrict: (district: string) => void;
}

const DistrictSelector: React.FC<Props> = ({ division, onSelectDistrict }) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDistrictData = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL;

        const [allRes, withStoriesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/districts?division=${division}`),
          fetch(`${BASE_URL}/api/districts-with-stories?division=${division}`),
        ]);

        const allDistricts = await allRes.json(); // [{ name: "ঢাকা" }, ...]
        const districtsWithStories = await withStoriesRes.json(); // [{ _id: "ঢাকা", count: 3 }, ...]

        const storySet = new Set<string>(
          districtsWithStories.map((d: any) => d._id)
        );

        const merged: District[] = allDistricts.map((d: any) => ({
          name: d.name,
          hasStories: storySet.has(d.name),
        }));

        if (isMounted) {
          setDistricts(merged);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch districts:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchDistrictData();

    return () => {
      isMounted = false; // cleanup
    };
  }, [division]);

  if (loading) {
    return <p className="text-center text-gray-400">লোড হচ্ছে…</p>;
  }

  return (
    <div className="text-center mt-8">
      <h2 className="text-3xl font-bold text-yellow-300 mb-6">
        জেলা নির্বাচন করুন
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {districts.map(({ name, hasStories }) => (
          <button
            key={name}
            onClick={() => onSelectDistrict(name)}
            className={`p-6 rounded-xl shadow-lg border transition-all hover:scale-105
              ${
                hasStories
                  ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white border-green-400 animate-pulse"
                  : "bg-gray-800 text-gray-400 border-gray-600"
              }`}
          >
            📍 {name} {hasStories && "📚"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DistrictSelector;
