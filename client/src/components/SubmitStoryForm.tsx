import React, { useState } from "react";
import { divisions } from "../data/divisions";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Don't forget to add <ToastContainer /> in App.tsx

interface SubmitStoryFormProps {
  onCancel: () => void;
  onSubmitted: () => void;
}

const SubmitStoryForm: React.FC<SubmitStoryFormProps> = ({
  onCancel,
  onSubmitted,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    division: "",
    district: "",
    source: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://bd-horor-atlas.onrender.com/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("✅ গল্প সফলভাবে জমা হয়েছে! অনুমোদনের জন্য অপেক্ষা করুন।");

        setFormData({
          title: "",
          content: "",
          division: "",
          district: "",
          source: "",
        });

        // ✅ Wait 2 seconds before calling onSubmitted
        setTimeout(() => {
          onSubmitted();
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "❌ গল্প জমা ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("❌ সার্ভার সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDivision = divisions.find((d) => d.id === formData.division);

  return (
    <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden bg-gradient-to-br from-gray-950 to-black font-sans">
      {/* Backgrounds and orbs */}
      <div
        className="absolute inset-0 z-0 bg-repeat opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M9 0H6v6l3-3V0zm3 3v3L9 6V3h3z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="absolute top-1/4 left-1/12 w-48 h-48 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move z-0"></div>
      <div className="absolute bottom-1/4 right-1/12 w-40 h-40 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-orb-move delay-500 z-0"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-orb-move delay-1000 z-0"></div>

      {/* Form Container */}
      <div className="relative z-10 max-w-2xl mx-auto bg-gray-900/80 p-6 sm:p-8 lg:p-10 mt-10 mb-10 rounded-3xl border border-purple-800/50 shadow-3xl backdrop-blur-md transform hover:scale-[1.005] transition-all duration-300 ease-in-out animate-fade-in">
        {/* Instructions */}
        <div className="mb-8 p-6 bg-purple-900/40 rounded-2xl border border-purple-700 shadow-xl">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-purple-300">
            📘 জমা দেওয়ার নির্দেশাবলী
          </h3>
          <ul className="list-disc list-inside text-purple-200 space-y-2 text-base leading-relaxed">
            <li>আপনার ভৌতিক গল্পটি পরিষ্কারভাবে লিখুন।</li>
            <li>বাংলায় লিখুন, ইংরেজিও গ্রহণযোগ্য।</li>
            <li>বিভাগ ও জেলা নির্ভুলভাবে নির্বাচন করুন।</li>
            <li>উৎস ঐচ্ছিক।</li>
            <li>জমা দেওয়ার পর অনুমোদনের জন্য অপেক্ষা করুন।</li>
          </ul>
        </div>

        <h2 className="text-4xl font-extrabold mb-8 text-purple-400 text-center drop-shadow-xl">
          একটি ভূতের গল্প জমা দিন 👻
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="গল্পের শিরোনাম"
            value={formData.title}
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl bg-gray-800/70 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            required
          />

          {/* Content */}
          <TextareaAutosize
            name="content"
            placeholder="আপনার ভৌতিক গল্প লিখুন..."
            value={formData.content}
            onChange={handleChange}
            minRows={7}
            className="w-full py-3 px-4 rounded-xl bg-gray-800/70 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-y"
            required
          />

          {/* Division */}
          <select
            name="division"
            value={formData.division}
            onChange={handleChange}
            required
            className="w-full py-3 px-4 rounded-xl bg-gray-800/70 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="" disabled>
              বিভাগ নির্বাচন করুন
            </option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>
                {div.name}
              </option>
            ))}
          </select>

          {/* District */}
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={!selectedDivision}
            className="w-full py-3 px-4 rounded-xl bg-gray-800/70 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="" disabled>
              জেলা নির্বাচন করুন
            </option>
            {selectedDivision?.districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Source */}
          <input
            type="text"
            name="source"
            placeholder="(ঐচ্ছিক) উৎস বা রেফারেন্স"
            value={formData.source}
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl bg-gray-800/70 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />

          {/* Buttons */}
          <div className="flex justify-between items-center flex-wrap gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded transition-colors duration-200"
            >
              ❌ বাতিল করুন
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition-colors duration-200"
            >
              🏠 হোমে যান
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "জমা হচ্ছে..." : "📤 গল্প জমা দিন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitStoryForm;
