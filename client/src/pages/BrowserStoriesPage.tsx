// src/pages/BrowseStoriesPage.tsx
import React, { useState, useEffect } from "react";
import DivisionSelector from "../components/DivisionSelector";
import StoryList from "../components/StoryList";
import { divisions } from "../data/divisions";
import type { Story } from "../types";

const BrowseStoriesPage: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [districtsWithStories, setDistrictsWithStories] = useState<Set<string>>(new Set());

  const selectedDivisionData = divisions.find((d) => d.id === selectedDivision);
  const selectedDistrictData = selectedDivisionData?.districts.find((d) => d.id === selectedDistrict);

  const handleDivisionSelect = (id: string) => {
    setSelectedDivision(id);
    setSelectedDistrict(null);
    setStories([]);
    setError(null);
  };

  const handleDistrictSelect = (id: string) => {
    setSelectedDistrict(id);
    fetchStoriesByDistrict(id);
  };

  const fetchStoriesByDistrict = (districtId: string) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/stories?district=${districtId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stories");
        return res.json();
      })
      .then((data: Story[]) => {
        setStories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!selectedDivision) return;

    fetch(`http://localhost:5000/api/districts-with-stories?division=${selectedDivision}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch story info");
        return res.json();
      })
      .then((data) => {
        const storyDistricts = new Set<string>(data.map((d: any) => d._id));
        setDistrictsWithStories(storyDistricts);
      })
      .catch(() => {
        setDistrictsWithStories(new Set());
      });
  }, [selectedDivision]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      {!selectedDivision ? (
        <DivisionSelector divisions={divisions} onSelect={handleDivisionSelect} />
      ) : !selectedDistrict ? (
        <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800">
          <button
            onClick={() => setSelectedDivision(null)}
            className="mb-6 text-md text-blue-400 hover:text-blue-300 transition"
          >
            ← বিভাগে ফিরে যান
          </button>

          <h2 className="text-3xl font-bold mb-6 text-pink-400 border-b pb-3 border-pink-700">
            {selectedDivisionData?.name} বিভাগের জেলা সমূহ:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {selectedDivisionData?.districts.map((district) => {
              const hasStory = districtsWithStories.has(district.id);
              return (
                <button
                  key={district.id}
                  onClick={() => handleDistrictSelect(district.id)}
                  className="relative bg-indigo-800 hover:bg-indigo-700 p-5 rounded-xl text-lg font-medium shadow-lg transition transform hover:-translate-y-1"
                >
                  📍 {district.name}
                  {hasStory && (
                    <span className="absolute top-2 right-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full animate-pulse">
                      📚 গল্প আছে
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : loading ? (
        <p className="text-center mt-20">📚 গল্পগুলো লোড হচ্ছে...</p>
      ) : error ? (
        <p className="text-center text-red-400 mt-20">ভুল হয়েছে: {error}</p>
      ) : (
        <StoryList
          district={selectedDistrictData?.name || ""}
          stories={stories}
          onBack={() => setSelectedDistrict(null)}
        />
      )}
    </div>
  );
};

export default BrowseStoriesPage;
