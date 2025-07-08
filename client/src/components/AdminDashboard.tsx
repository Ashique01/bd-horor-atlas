import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitStoryForm from "../components/SubmitStoryForm"; // Assuming this component exists and is styled appropriately

// A flat map from district id to Bengali district name (copied from HomePage.tsx)
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
  kishoreganj_mym: "কিশোরগঞ্জ",
};

interface Story {
  _id: string;
  title: string;
  content: string;
  division: string;
  district: string;
  source?: string;
  isAdminApproved: boolean;
  isRejected?: boolean;
}

const PAGE_SIZE = 5;

const AdminDashboard: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [expandedStoryIds, setExpandedStoryIds] = useState<Set<string>>(
    new Set()
  );

  // Pagination states
  const [pendingPage, setPendingPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);

  // Filter search input
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // State for custom confirmation/alert modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const openConfirmModal = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action); // Use a function to set the action
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const executeConfirmAction = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirmModal();
  };

  const openInfoModal = (message: string) => {
    setInfoMessage(message);
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setInfoMessage("");
  };

  const fetchAllStories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories?all=true`);
      if (!res.ok) throw new Error("Failed to fetch stories");
      const data: Story[] = await res.json();
      setStories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      openInfoModal(`গল্প আনতে ব্যর্থ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStories();
  }, []);

  // Filter stories by search term on division or district
  const filteredStories = stories.filter((s) =>
    `${s.division} ${districtNameMap[s.district] || s.district}` // Use mapped name for search
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const pendingStories = filteredStories.filter(
    (s) => !s.isAdminApproved && !s.isRejected
  );
  const rejectedStories = filteredStories.filter((s) => s.isRejected);

  // Pagination slices
  const paginatedPending = pendingStories.slice(
    (pendingPage - 1) * PAGE_SIZE,
    pendingPage * PAGE_SIZE
  );
  const paginatedRejected = rejectedStories.slice(
    (rejectedPage - 1) * PAGE_SIZE,
    rejectedPage * PAGE_SIZE
  );

  const updateStoryStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/stories/${id}/${status}`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error(`Failed to ${status} story`);
      setSelectedStory(null);
      fetchAllStories(); // Refresh stories to reflect changes
      openInfoModal(
        status === "approved" ? "✅ অনুমোদন হয়েছে!" : "❌ বাতিল করা হয়েছে!"
      );
    } catch (err: any) {
      openInfoModal(`স্টোরি ${status === "approved" ? "অনুমোদন" : "বাতিল"} করতে ব্যর্থ: ${err.message}`);
    }
  };

  // Update story content (for rejected story editing)
  const updateStoryContent = async (id: string, newContent: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`, {
        method: "PUT", // Assuming you have a PUT endpoint for update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent, isAdminApproved: true, isRejected: false }), // Set to approved after editing
      });
      if (!res.ok) throw new Error("Failed to update story");
      openInfoModal("✏️ স্টোরি সফলভাবে আপডেট ও অনুমোদন হয়েছে!");
      fetchAllStories(); // Refresh stories
      setSelectedStory(null); // Close modal
    } catch (err: any) {
      openInfoModal(`স্টোরি আপডেট করতে ব্যর্থ: ${err.message}`);
    }
  };

  const deleteStory = async (id: string) => {
    openConfirmModal("আপনি কি নিশ্চিত এই স্টোরিটি মুছে ফেলতে চান?", async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete story");
        openInfoModal("🗑️ স্টোরি মুছে ফেলা হয়েছে!");
        fetchAllStories(); // Refresh stories
      } catch (err: any) {
        openInfoModal(`স্টোরি মুছে ফেলতে ব্যর্থ: ${err.message}`);
      }
    });
  };

  const clearAllRejected = async () => {
    openConfirmModal("আপনি কি নিশ্চিত সব বাতিলকৃত স্টোরি মুছে ফেলতে চান?", async () => {
      try {
        // Fetch all rejected stories again to ensure we have the latest list
        const currentRejectedStories = stories.filter((s) => s.isRejected);
        const rejectedIds = currentRejectedStories.map((s) => s._id);

        if (rejectedIds.length === 0) {
            openInfoModal("মুছে ফেলার জন্য কোনো বাতিলকৃত গল্প নেই।");
            return;
        }

        // Use Promise.allSettled to ensure all promises are attempted even if some fail
        const results = await Promise.allSettled(
          rejectedIds.map((id) =>
            fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`, { method: "DELETE" })
          )
        );

        const failedDeletions = results.filter(result => result.status === 'rejected');

        if (failedDeletions.length > 0) {
          openInfoModal(`কিছু বাতিলকৃত গল্প মুছে ফেলা সম্ভব হয়নি। (${failedDeletions.length} ব্যর্থ)`);
        } else {
          openInfoModal("সব বাতিলকৃত গল্প মুছে ফেলা হয়েছে!");
        }
        
        fetchAllStories(); // Refresh stories after attempting deletions
        setRejectedPage(1); // Reset pagination
      } catch (err: any) {
        openInfoModal("সব মুছে ফেলা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  const toggleExpand = (id: string) => {
    setExpandedStoryIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const total = stories.length;
  const approved = stories.filter(
    (s) => s.isAdminApproved && !s.isRejected
  ).length;
  const rejected = stories.filter((s) => s.isRejected).length;
  const pending = stories.filter(
    (s) => !s.isAdminApproved && !s.isRejected
  ).length;

  const districtCountMapFormatted: Record<string, number> = {};
  stories.forEach((story) => {
    const divisionName = story.division;
    const districtName = districtNameMap[story.district] || story.district; // Use mapped name
    const key = `${divisionName} - ${districtName}`;
    districtCountMapFormatted[key] = (districtCountMapFormatted[key] || 0) + 1;
  });

  const topDistricts = Object.entries(districtCountMapFormatted)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Local state for editing rejected story content in modal
  const [editContent, setEditContent] = useState<string>("");

  // Open edit modal and set content
  const openEditModal = (story: Story) => {
    setSelectedStory(story);
    setEditContent(story.content);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">গল্প লোড হচ্ছে...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p className="text-xl">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl text-blue-400 font-bold text-center sm:text-left mb-4 sm:mb-0 flex-grow">
            👨‍💻 অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
          >
            🚪 লগআউট
          </button>
        </div>

        {/* Search/filter input */}
        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="বিভাগ বা জেলা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPendingPage(1);
              setRejectedPage(1);
            }}
            className="w-full max-w-md p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search stories"
          />
        </div>

        {/* Story Submission Form Toggle */}
        <div className="text-right mb-6">
          <button
            onClick={() => setShowSubmitForm((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
          >
            {showSubmitForm ? "➖ সাবমিশন ফর্ম বন্ধ করুন" : "➕ নতুন গল্প জমা দিন"}
          </button>
        </div>

        {showSubmitForm && (
          <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-inner">
            <SubmitStoryForm
              onCancel={() => setShowSubmitForm(false)}
              onSubmitted={() => {
                setShowSubmitForm(false);
                fetchAllStories();
              }}
            />
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
          <div className="bg-gray-700 p-4 rounded-lg shadow">
            <p className="text-md font-semibold text-gray-300">মোট গল্প</p>
            <p className="text-3xl text-blue-300 font-bold mt-1">{total}</p>
          </div>
          <div className="bg-green-700 p-4 rounded-lg shadow">
            <p className="text-md font-semibold text-gray-300">অনুমোদিত</p>
            <p className="text-3xl text-green-300 font-bold mt-1">{approved}</p>
          </div>
          <div className="bg-yellow-700 p-4 rounded-lg shadow">
            <p className="text-md font-semibold text-gray-300">পর্যালোচনাধীন</p>
            <p className="text-3xl text-yellow-300 font-bold mt-1">{pending}</p>
          </div>
          <div className="bg-red-700 p-4 rounded-lg shadow">
            <p className="text-md font-semibold text-gray-300">বাতিলকৃত</p>
            <p className="text-3xl text-red-300 font-bold mt-1">{rejected}</p>
          </div>
        </div>

        {/* Top Districts */}
        <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow">
          <h2 className="text-xl text-blue-300 font-semibold mb-4">
            📊 শীর্ষ জেলা সমূহ (গল্পের সংখ্যার ভিত্তিতে)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topDistricts.map(([key, count], idx) => {
              const [division, district] = key.split(" - ");
              return (
                <div
                  key={idx}
                  className="bg-gray-600 p-3 rounded-md shadow-sm"
                >
                  <p className="text-md text-white font-semibold mb-0">
                    {idx + 1}. <span className="text-blue-200">{district}</span>,{" "}
                    <span className="text-green-200">{division}</span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    গল্পের সংখ্যা:{" "}
                    <span className="text-blue-300 font-bold">{count}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Stories */}
        <h2 className="text-2xl text-yellow-300 font-semibold mb-4 mt-8">
          🕵️ পর্যালোচনাধীন গল্পসমূহ
        </h2>
        {pendingStories.length === 0 ? (
          <p className="text-center text-gray-400 p-6 bg-gray-700 rounded-lg shadow">
            পর্যালোচনার জন্য কোনো গল্প নেই।
          </p>
        ) : (
          <>
            <ul>
              {paginatedPending.map((story) => (
                <li
                  key={story._id}
                  className="bg-gray-700 p-4 mb-4 rounded-lg border border-gray-600 shadow"
                >
                  <h3 className="text-xl font-semibold mb-2 text-pink-300">
                    {story.title}
                  </h3>
                  <p
                    className={`mb-2 whitespace-pre-line text-gray-200 text-sm ${
                      expandedStoryIds.has(story._id) ? "" : "line-clamp-3"
                    }`}
                  >
                    {story.content}
                  </p>
                  <button
                    onClick={() => toggleExpand(story._id)}
                    className="text-blue-400 hover:underline text-xs mb-2"
                  >
                    {expandedStoryIds.has(story._id)
                      ? "▲ কম দেখুন"
                      : "📖 বিস্তারিত পড়ুন →"}
                  </button>
                  <p className="italic text-xs mb-2 text-gray-400">
                    বিভাগ: {story.division} | জেলা: {districtNameMap[story.district] || story.district}
                  </p>
                  {story.source && (
                    <p className="mb-2 text-xs text-gray-500">
                      উৎস: {story.source}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStoryStatus(story._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
                      >
                        ✅ অনুমোদন করুন
                      </button>
                      <button
                        onClick={() => updateStoryStatus(story._id, "rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
                      >
                        ❌ বাতিল করুন
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="text-sm text-blue-400 hover:underline mt-1 sm:mt-0"
                    >
                      📖 বিস্তারিত দেখুন (মোডাল) →
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination for pending */}
            {pendingStories.length > PAGE_SIZE && (
              <div className="text-center mt-4 flex justify-center space-x-3">
                <button
                  disabled={pendingPage === 1}
                  onClick={() => setPendingPage(pendingPage - 1)}
                  className="px-4 py-1 rounded-md bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm"
                >
                  ⬅️ পূর্ববর্তী
                </button>
                <button
                  disabled={pendingPage * PAGE_SIZE >= pendingStories.length}
                  onClick={() => setPendingPage(pendingPage + 1)}
                  className="px-4 py-1 rounded-md bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm"
                >
                  পরবর্তী ➡️
                </button>
              </div>
            )}
          </>
        )}

        {/* Rejected Stories */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-10 mb-4">
          <h2 className="text-2xl text-red-300 font-semibold mb-4 sm:mb-0">
            ❌ বাতিলকৃত গল্পসমূহ
          </h2>
          {rejectedStories.length > 0 && (
            <button
              onClick={clearAllRejected}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
            >
              🗑️ সব বাতিলকৃত গল্প মুছে ফেলুন
            </button>
          )}
        </div>

        {rejectedStories.length === 0 ? (
          <p className="text-center text-gray-500 p-6 bg-gray-700 rounded-lg shadow">
            এখনও কোনো বাতিলকৃত গল্প নেই।
          </p>
        ) : (
          <>
            <ul>
              {paginatedRejected.map((story) => (
                <li
                  key={story._id}
                  className="bg-gray-700 p-4 mb-4 rounded-lg border border-red-600 shadow"
                >
                  <h3 className="text-xl text-red-300 font-semibold mb-2">
                    {story.title}
                  </h3>
                  <p
                    className={`text-gray-300 mb-2 whitespace-pre-line text-sm ${
                      expandedStoryIds.has(story._id) ? "" : "line-clamp-3"
                    }`}
                  >
                    {story.content}
                  </p>
                  <button
                    onClick={() => toggleExpand(story._id)}
                    className="text-blue-400 hover:underline text-xs mb-2"
                  >
                    {expandedStoryIds.has(story._id)
                      ? "▲ কম দেখুন"
                      : "📖 বিস্তারিত পড়ুন →"}
                  </button>
                  <p className="text-xs text-gray-500 italic mb-2">
                    বিভাগ: {story.division} | জেলা: {districtNameMap[story.district] || story.district}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => openEditModal(story)}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md text-sm font-semibold"
                    >
                      ✏️ এডিট ও অনুমোদন করুন
                    </button>
                    <button
                      onClick={() => deleteStory(story._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
                    >
                      🗑️ মুছে ফেলুন
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination for rejected */}
            {rejectedStories.length > PAGE_SIZE && (
              <div className="text-center mt-4 flex justify-center space-x-3">
                <button
                  disabled={rejectedPage === 1}
                  onClick={() => setRejectedPage(rejectedPage - 1)}
                  className="px-4 py-1 rounded-md bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm"
                >
                  ⬅️ পূর্ববর্তী
                </button>
                <button
                  disabled={rejectedPage * PAGE_SIZE >= rejectedStories.length}
                  onClick={() => setRejectedPage(rejectedPage + 1)}
                  className="px-4 py-1 rounded-md bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm"
                >
                  পরবর্তী ➡️
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit & Approve Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xl w-full text-white border border-gray-700">
            <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
              ✏️ গল্প এডিট ও অনুমোদন করুন
            </h2>
            <p className="text-md text-gray-400 mb-4 text-center">
              বিভাগ: {selectedStory.division} | জেলা: {districtNameMap[selectedStory.district] || selectedStory.district}
            </p>
            <textarea
              className="w-full h-48 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              aria-label="Story content"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setSelectedStory(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold"
              >
                ✖️ বাতিল করুন
              </button>
              <button
                onClick={() =>
                  updateStoryContent(selectedStory._id, editContent)
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
              >
                ✅ আপডেট ও অনুমোদন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xs w-full text-white border border-gray-700">
            <h3 className="text-xl font-bold text-red-400 mb-4 text-center">নিশ্চিত করুন</h3>
            <p className="text-md text-gray-300 mb-6 text-center">{confirmMessage}</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={closeConfirmModal}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold"
              >
                না
              </button>
              <button
                onClick={executeConfirmAction}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
              >
                হ্যাঁ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xs w-full text-white border border-gray-700">
            <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">তথ্য</h3>
            <p className="text-md text-gray-300 mb-6 text-center">{infoMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={closeInfoModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
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

export default AdminDashboard;