import React, { useEffect, useState } from "react";

interface Story {
  _id: string;
  title: string;
  content: string;
  division: string;
  district: string;
  source?: string;
  status: "pending" | "approved" | "rejected";
}

const PendingStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [expandedStoryIds, setExpandedStoryIds] = useState<Set<string>>(
    new Set()
  );

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/stories?status=pending"
      );
      if (!res.ok) throw new Error("Failed to fetch pending stories");
      const data = await res.json();
      setStories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/stories/${id}/${
          status === "approved" ? "approve" : "reject"
        }`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error("Failed to update story status");
      setStories((prev) => prev.filter((s) => s._id !== id));
      setSelectedStory(null); // close modal
      setExpandedStoryIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedStoryIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-white max-w-5xl mt-10">
      <h1 className="text-3xl text-purple-400 font-bold mb-6 text-center">
        📜 সকল Pending Story
      </h1>

      {loading && <p className="text-center text-white">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {stories.length === 0 ? (
        <p className="text-center text-gray-400">No pending stories.</p>
      ) : (
        <ul>
          {stories.map((story) => (
            <li
              key={story._id}
              className="bg-gray-800 p-4 mb-4 rounded border border-gray-700 shadow"
            >
              <h3 className="text-xl font-semibold text-pink-300">
                {story.title}
              </h3>
              <p
                className={`text-gray-200 whitespace-pre-line my-2 ${
                  expandedStoryIds.has(story._id) ? "" : "line-clamp-3"
                }`}
              >
                {story.content}
              </p>
              <button
                onClick={() => toggleExpand(story._id)}
                className="text-blue-400 hover:underline text-sm mb-2"
              >
                {expandedStoryIds.has(story._id)
                  ? "▲ Show less"
                  : "📖 বিস্তারিত পড়ুন →"}
              </button>
              <p className="text-sm italic text-gray-400">
                Division: {story.division} | District: {story.district}
              </p>
              {story.source && (
                <p className="text-sm text-gray-500">Source: {story.source}</p>
              )}
              <div className="flex justify-between items-center mt-3 flex-wrap">
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateStatus(story._id, "approved")}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => updateStatus(story._id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    ❌ Reject
                  </button>
                </div>
                <button
                  onClick={() => setSelectedStory(story)}
                  className="text-blue-400 hover:underline mt-2 text-sm"
                >
                  📖 বিস্তারিত পড়ুন → (Modal)
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg max-w-2xl w-full text-white">
            <h2 className="text-xl font-bold text-purple-400 mb-2">
              {selectedStory.title}
            </h2>
            <p className="text-sm text-gray-400 mb-1">
              বিভাগ: {selectedStory.division} | জেলা: {selectedStory.district}
            </p>
            {selectedStory.source && (
              <p className="text-xs text-gray-500 mb-2">
                Source: {selectedStory.source}
              </p>
            )}
            <p className="whitespace-pre-wrap text-gray-100 mb-4">
              {selectedStory.content}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedStory(null)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              >
                ✖️ বন্ধ করুন
              </button>
              <button
                onClick={() => updateStatus(selectedStory._id, "approved")}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                ✅ অনুমোদন করুন
              </button>
              <button
                onClick={() => updateStatus(selectedStory._id, "rejected")}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                ❌ বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingStoriesPage;
