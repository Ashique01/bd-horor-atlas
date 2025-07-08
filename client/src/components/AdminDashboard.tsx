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
      const res = await fetch("http://localhost:5000/api/stories?all=true");
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
        `http://localhost:5000/api/stories/${id}/${status}`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error(`Failed to ${status} story`);
      setSelectedStory(null);
      fetchAllStories();
      openInfoModal(
        status === "approved" ? "✅ অনুমোদন হয়েছে!" : "❌ বাতিল করা হয়েছে!"
      );
    } catch (err: any) {
      openInfoModal(err.message);
    }
  };

  // Update story content (for rejected story editing)
  const updateStoryContent = async (id: string, newContent: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stories/${id}`, {
        method: "PUT", // Assuming you have a PUT endpoint for update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) throw new Error("Failed to update story");
      openInfoModal("✏️ স্টোরি সফলভাবে আপডেট হয়েছে!");
      fetchAllStories();
      setSelectedStory(null);
    } catch (err: any) {
      openInfoModal(err.message);
    }
  };

  const deleteStory = async (id: string) => {
    openConfirmModal("আপনি কি নিশ্চিত এই স্টোরিটি মুছে ফেলতে চান?", async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/stories/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete story");
        openInfoModal("🗑️ স্টোরি মুছে ফেলা হয়েছে!");
        fetchAllStories();
      } catch (err: any) {
        openInfoModal(err.message);
      }
    });
  };

  const clearAllRejected = async () => {
    openConfirmModal("আপনি কি নিশ্চিত সব বাতিলকৃত স্টোরি মুছে ফেলতে চান?", async () => {
      try {
        const rejectedIds = rejectedStories.map((s) => s._id);
        await Promise.all(
          rejectedIds.map((id) =>
            fetch(`http://localhost:5000/api/stories/${id}`, { method: "DELETE" })
          )
        );
        openInfoModal("সব বাতিলকৃত স্টোরি মুছে ফেলা হয়েছে!");
        fetchAllStories();
        setRejectedPage(1);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white">
        <p className="text-xl animate-pulse">গল্প লোড হচ্ছে...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-red-500">
        <p className="text-xl">Error: {error}</p>
      </div>
    );

  return (
    <div
      className="min-h-screen flex flex-col items-center text-white relative overflow-hidden
                 bg-gradient-to-br from-gray-950 to-black font-sans"
    >
      {/* Subtle textured overlay */}
      <div className="absolute inset-0 z-0 bg-repeat opacity-10"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M9 0H6v6l3-3V0zm3 3v3L9 6V3h3z'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Subtle Background Orbs */}
      <div className="absolute top-1/4 left-1/12 w-48 h-48 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move z-0"></div>
      <div className="absolute bottom-1/4 right-1/12 w-40 h-40 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move delay-500 z-0"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-orb-move delay-1000 z-0"></div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 custom-scrollbar max-w-screen-xl">
        <div className="bg-gray-900/80 rounded-3xl shadow-3xl backdrop-blur-md border border-purple-800/50 max-w-7xl w-full p-6 sm:p-8 lg:p-10 mb-10 transform hover:scale-[1.005] transition-all duration-300 ease-in-out">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl sm:text-5xl text-purple-400 font-extrabold text-center sm:text-left mb-4 sm:mb-0 drop-shadow-xl flex-grow">
              👨‍💻 অ্যাডমিন ড্যাশবোর্ড
            </h1>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl uppercase tracking-wider glow-effect"
            >
              🚪 লগআউট
            </button>
          </div>

          {/* Search/filter input */}
          <div className="mb-8 text-center">
            <input
              type="text"
              placeholder="বিভাগ বা জেলা দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPendingPage(1);
                setRejectedPage(1);
              }}
              className="w-full max-w-md py-3 px-4 rounded-xl bg-gray-700/60 text-white placeholder-gray-400
                         border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                         transition-all duration-200"
              aria-label="Search stories"
            />
          </div>

          {/* Story Submission Form Toggle */}
          <div className="text-right mb-8">
            <button
              onClick={() => setShowSubmitForm((prev) => !prev)}
              className="bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl uppercase tracking-wider glow-effect"
            >
              {showSubmitForm ? "➖ সাবমিশন ফর্ম বন্ধ করুন" : "➕ নতুন গল্প জমা দিন"}
            </button>
          </div>

          {showSubmitForm && (
            <div className="mb-10 p-6 bg-gray-800/70 rounded-2xl shadow-2xl border border-indigo-700/50">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
            <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-gray-700">
              <p className="text-xl font-semibold text-gray-300">মোট গল্প</p>
              <p className="text-4xl text-purple-400 font-bold mt-2">{total}</p>
            </div>
            <div className="bg-green-900/70 p-6 rounded-2xl shadow-xl border border-green-700">
              <p className="text-xl font-semibold text-gray-300">অনুমোদিত</p>
              <p className="text-4xl text-green-300 font-bold mt-2">{approved}</p>
            </div>
            <div className="bg-yellow-900/70 p-6 rounded-2xl shadow-xl border border-yellow-700">
              <p className="text-xl font-semibold text-gray-300">পর্যালোচনাধীন</p>
              <p className="text-4xl text-yellow-300 font-bold mt-2">{pending}</p>
            </div>
            <div className="bg-red-900/70 p-6 rounded-2xl shadow-xl border border-red-700">
              <p className="text-xl font-semibold text-gray-300">বাতিলকৃত</p>
              <p className="text-4xl text-red-300 font-bold mt-2">{rejected}</p>
            </div>
          </div>

          {/* Top Districts */}
          <div className="mb-10 p-6 bg-gray-800/70 rounded-2xl shadow-2xl border border-pink-700/50">
            <h2 className="text-3xl text-pink-400 font-semibold mb-6">
              📊 শীর্ষ জেলা সমূহ (গল্পের সংখ্যার ভিত্তিতে)
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topDistricts.map(([key, count], idx) => {
                const [division, district] = key.split(" - ");
                return (
                  <div
                    key={idx}
                    className="bg-gray-700/60 p-4 rounded-xl shadow-md border border-gray-600 hover:border-purple-500 transition-all duration-200"
                  >
                    <p className="text-lg text-white font-semibold mb-1">
                      {idx + 1}. <span className="text-blue-400">{district}</span>,{" "}
                      <span className="text-green-400">{division}</span>
                    </p>
                    <p className="text-gray-300">
                      গল্পের সংখ্যা:{" "}
                      <span className="text-purple-300 font-bold">{count}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Stories */}
          <h2 className="text-3xl text-blue-400 font-semibold mb-6 mt-10">
            🕵️ পর্যালোচনাধীন গল্পসমূহ
          </h2>
          {pendingStories.length === 0 ? (
            <p className="text-center text-gray-400 text-lg py-8 bg-gray-800/70 rounded-2xl shadow-xl border border-gray-700">
              পর্যালোচনার জন্য কোনো গল্প নেই।
            </p>
          ) : (
            <>
              <ul>
                {paginatedPending.map((story) => (
                  <li
                    key={story._id}
                    className="bg-gray-800/70 p-6 mb-6 rounded-2xl border border-gray-700 shadow-xl transform hover:scale-[1.005] transition-all duration-200"
                  >
                    <h3 className="text-2xl font-semibold mb-2 text-pink-300">
                      {story.title}
                    </h3>
                    <p
                      className={`mb-3 whitespace-pre-line text-gray-200 leading-relaxed ${
                        expandedStoryIds.has(story._id) ? "" : "line-clamp-3"
                      }`}
                    >
                      {story.content}
                    </p>
                    <button
                      onClick={() => toggleExpand(story._id)}
                      className="text-blue-400 hover:underline text-sm mb-4 transition-colors duration-200"
                    >
                      {expandedStoryIds.has(story._id)
                        ? "▲ কম দেখুন"
                        : "📖 বিস্তারিত পড়ুন →"}
                    </button>
                    <p className="italic text-sm mb-2 text-gray-400">
                      বিভাগ: {story.division} | জেলা: {districtNameMap[story.district] || story.district}
                    </p>
                    {story.source && (
                      <p className="mb-3 text-sm text-gray-500">
                        উৎস: {story.source}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => updateStoryStatus(story._id, "approved")}
                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 px-6 py-3 rounded-full text-base font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
                        >
                          ✅ অনুমোদন করুন
                        </button>
                        <button
                          onClick={() => updateStoryStatus(story._id, "rejected")}
                          className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 px-6 py-3 rounded-full text-base font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
                        >
                          ❌ বাতিল করুন
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedStory(story)}
                        className="text-base text-blue-400 hover:underline transition-colors duration-200 mt-2 sm:mt-0"
                      >
                        📖 বিস্তারিত দেখুন (মোডাল) →
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination for pending */}
              {pendingStories.length > PAGE_SIZE && (
                <div className="text-center mt-6 flex justify-center space-x-4">
                  <button
                    disabled={pendingPage === 1}
                    onClick={() => setPendingPage(pendingPage - 1)}
                    className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200"
                  >
                    ⬅️ পূর্ববর্তী
                  </button>
                  <button
                    disabled={pendingPage * PAGE_SIZE >= pendingStories.length}
                    onClick={() => setPendingPage(pendingPage + 1)}
                    className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200"
                  >
                    পরবর্তী ➡️
                  </button>
                </div>
              )}
            </>
          )}

          {/* Rejected Stories */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 mb-6">
            <h2 className="text-3xl text-red-400 font-semibold mb-4 sm:mb-0">
              ❌ বাতিলকৃত গল্পসমূহ
            </h2>
            {rejectedStories.length > 0 && (
              <button
                onClick={clearAllRejected}
                className="bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-800 hover:to-rose-900 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl uppercase tracking-wider glow-effect"
              >
                🗑️ সব বাতিলকৃত গল্প মুছে ফেলুন
              </button>
            )}
          </div>

          {rejectedStories.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-8 bg-gray-800/70 rounded-2xl shadow-xl border border-gray-700">
              এখনও কোনো বাতিলকৃত গল্প নেই।
            </p>
          ) : (
            <>
              <ul>
                {paginatedRejected.map((story) => (
                  <li
                    key={story._id}
                    className="bg-gray-800/70 p-6 mb-6 rounded-2xl border border-red-600 shadow-xl transform hover:scale-[1.005] transition-all duration-200"
                  >
                    <h3 className="text-2xl text-red-300 font-semibold mb-2">
                      {story.title}
                    </h3>
                    <p
                      className={`text-gray-300 mb-3 whitespace-pre-line leading-relaxed ${
                        expandedStoryIds.has(story._id) ? "" : "line-clamp-3"
                      }`}
                    >
                      {story.content}
                    </p>
                    <button
                      onClick={() => toggleExpand(story._id)}
                      className="text-blue-400 hover:underline text-sm mb-4 transition-colors duration-200"
                    >
                      {expandedStoryIds.has(story._id)
                        ? "▲ কম দেখুন"
                        : "📖 বিস্তারিত পড়ুন →"}
                    </button>
                    <p className="text-sm text-gray-500 italic mb-3">
                      বিভাগ: {story.division} | জেলা: {districtNameMap[story.district] || story.district}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => openEditModal(story)}
                        className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 px-6 py-3 rounded-full text-base font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
                      >
                        ✏️ এডিট ও অনুমোদন করুন
                      </button>
                      <button
                        onClick={() => deleteStory(story._id)}
                        className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 px-6 py-3 rounded-full text-base font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
                      >
                        🗑️ মুছে ফেলুন
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination for rejected */}
              {rejectedStories.length > PAGE_SIZE && (
                <div className="text-center mt-6 flex justify-center space-x-4">
                  <button
                    disabled={rejectedPage === 1}
                    onClick={() => setRejectedPage(rejectedPage - 1)}
                    className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200"
                  >
                    ⬅️ পূর্ববর্তী
                  </button>
                  <button
                    disabled={rejectedPage * PAGE_SIZE >= rejectedStories.length}
                    onClick={() => setRejectedPage(rejectedPage + 1)}
                    className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200"
                  >
                    পরবর্তী ➡️
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit & Approve Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900/90 p-8 rounded-3xl shadow-3xl backdrop-blur-md max-w-2xl w-full text-white border border-purple-700/50 transform scale-95 animate-scale-in">
            <h2 className="text-3xl font-bold text-purple-400 mb-4 text-center">
              ✏️ গল্প এডিট ও অনুমোদন করুন
            </h2>
            <p className="text-lg text-gray-400 mb-4 text-center">
              বিভাগ: {selectedStory.division} | জেলা: {districtNameMap[selectedStory.district] || selectedStory.district}
            </p>
            <textarea
              className="w-full h-60 p-4 bg-gray-800/70 border border-gray-600 rounded-xl text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              aria-label="Story content"
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setSelectedStory(null)}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
              >
                ✖️ বাতিল করুন
              </button>
              <button
                onClick={() =>
                  updateStoryContent(selectedStory._id, editContent)
                }
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
              >
                ✅ আপডেট ও অনুমোদন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900/90 p-8 rounded-3xl shadow-3xl backdrop-blur-md max-w-sm w-full text-white border border-red-700/50 transform scale-95 animate-scale-in">
            <h3 className="text-2xl font-bold text-red-400 mb-4 text-center">নিশ্চিত করুন</h3>
            <p className="text-lg text-gray-300 mb-6 text-center">{confirmMessage}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeConfirmModal}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
              >
                না
              </button>
              <button
                onClick={executeConfirmAction}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
              >
                হ্যাঁ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900/90 p-8 rounded-3xl shadow-3xl backdrop-blur-md max-w-sm w-full text-white border border-blue-700/50 transform scale-95 animate-scale-in">
            <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">তথ্য</h3>
            <p className="text-lg text-gray-300 mb-6 text-center">{infoMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={closeInfoModal}
                className="bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md glow-effect"
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
