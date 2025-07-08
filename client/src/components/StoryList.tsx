import React, { useState } from "react";
import type { Story } from "../types"; // Assuming this path is correct and Story type is defined

interface Props {
  district: string;
  stories: Story[];
  onBack: () => void;
}

const ITEMS_PER_PAGE = 5; // Define items per page for pagination

const StoryList: React.FC<Props> = ({ district, stories, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1); // State for current pagination page
  const [selectedStoryForModal, setSelectedStoryForModal] = useState<Story | null>(null); // State for story to display in modal

  // Calculate total pages, start index, and stories for the current page
  const totalPages = Math.ceil(stories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStories = stories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handler for navigating to the next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop(); // Scroll to top of the story list on page change
    }
  };

  // Handler for navigating to the previous page
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop(); // Scroll to top of the story list on page change
    }
  };

  // Function to scroll the story list container to the top
  const scrollToTop = () => {
    const container = document.getElementById("story-section-content"); // Changed ID for the scrollable div
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Function to open the modal with a specific story
  const openStoryModal = (story: Story) => {
    setSelectedStoryForModal(story);
  };

  // Function to close the modal
  const closeStoryModal = () => {
    setSelectedStoryForModal(null);
  };

  return (
    // Outer container for the page, matching the overall app theme
    <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden
                    bg-gradient-to-br from-gray-950 to-black font-sans">
      {/* Subtle textured overlay - adds depth without a heavy image */}
      <div className="absolute inset-0 z-0 bg-repeat opacity-10"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M9 0H6v6l3-3V0zm3 3v3L9 6V3h3z'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Subtle Background Orbs (Enhanced) */}
      <div className="absolute top-1/4 left-1/12 w-48 h-48 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move z-0"></div>
      <div className="absolute bottom-1/4 right-1/12 w-40 h-40 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move delay-500 z-0"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-orb-move delay-1000 z-0"></div>

      {/* Main Content Area - Scrollable */}
      <section className="relative z-10 mt-10 mb-10 max-w-4xl mx-auto p-6 sm:p-8 lg:p-10 text-left w-full
                          bg-gray-900/80 rounded-3xl shadow-3xl backdrop-blur-md
                          border border-purple-800/50 transform hover:scale-[1.005]
                          transition-all duration-300 ease-in-out animate-fade-in overflow-hidden">

        {/* Back Button - Simplified */}
        <button
          onClick={onBack}
          className="inline-flex items-center mb-8 px-5 py-2 bg-gray-700 hover:bg-gray-600
                     text-white font-semibold rounded-lg transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          জেলার তালিকায় ফিরে যান
        </button>

        {/* Section Title */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-pink-400 mb-8 pb-4 border-b-2 border-pink-600
                       drop-shadow-xl leading-tight">
          {district} জেলার ভৌতিক গল্পসমূহ
        </h2>

        {stories.length === 0 ? (
          <p className="text-gray-400 text-xl text-center py-10 bg-gray-800/70 rounded-2xl shadow-xl border border-gray-700">
            দুঃখিত, এই জেলায় কোনো গল্প পাওয়া যায়নি।
          </p>
        ) : (
          <>
            {/* Story List Container - Now with a specific ID for scrolling */}
            <div id="story-section-content" className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {currentStories.map(({ _id, title, content }) => (
                <article
                  key={_id}
                  className="bg-gray-800/70 rounded-2xl border border-gray-700 p-6 sm:p-8 shadow-xl
                             transition-transform hover:scale-[1.01] hover:border-purple-500 duration-300"
                >
                  <h3 className="text-2xl sm:text-3xl font-semibold text-yellow-300 mb-4 leading-snug">
                    {title}
                  </h3>
                  {/* Truncate content and add read more button */}
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base sm:text-lg line-clamp-6">
                    {content}
                  </p>
                  {content.length > 300 && ( // Adjust this threshold as needed
                    <button
                      onClick={() => openStoryModal({ _id, title, content, district })} // Pass required properties
                      className="mt-3 text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 text-sm inline-flex items-center"
                    >
                      📖 বিস্তারিত পড়ুন →
                    </button>
                  )}
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && ( // Only show pagination if there's more than one page
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-700 to-indigo-800
                             hover:from-purple-800 hover:to-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed
                             text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg glow-effect"
                >
                  ⬅️ পূর্ববর্তী
                </button>
                <span className="text-white font-semibold text-lg">
                  পৃষ্ঠা {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-700 to-indigo-800
                             hover:from-purple-800 hover:to-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed
                             text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg glow-effect"
                >
                  পরবর্তী ➡️
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Story Detail Modal */}
      {selectedStoryForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900/90 p-8 rounded-3xl shadow-3xl backdrop-blur-md max-w-2xl w-full text-white border border-purple-700/50 transform scale-95 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-purple-400 mb-4 text-center">
              {selectedStoryForModal.title}
            </h2>
            <p className="text-lg text-gray-300 whitespace-pre-wrap leading-relaxed mb-6">
              {selectedStoryForModal.content}
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeStoryModal}
                className="bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg glow-effect"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryList;
