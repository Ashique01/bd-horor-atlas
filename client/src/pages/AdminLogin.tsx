import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await fetch("https://bd-horor-atlas.onrender.com/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "প্রবেশ ব্যর্থ হয়েছে");
      return;
    }

    const data = await res.json();
    localStorage.setItem("adminToken", data.token); 
    localStorage.setItem("admin", "true");           
    navigate("/admin");                              
  } catch (err) {
    setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 text-purple-400 font-bold text-center">🔐 অ্যাডমিন প্রবেশ</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          placeholder="ইউজারনেম দিন"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="পাসওয়ার্ড দিন"
          className="w-full mb-6 p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold"
        >
          প্রবেশ করুন
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
