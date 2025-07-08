import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import SubmitStoryForm from "./components/SubmitStoryForm";
import AdminDashboard from "./components/AdminDashboard";
import PendingStoriesPage from "./pages/PendingStoriesPage";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import BrowseStoriesPage from "./pages/BrowserStoriesPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import NotFound from "./pages/NotFound";



function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  // Optional: resetSelection can also close menu if needed
  const resetSelection = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-black to-purple-950 text-white font-sans overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

         <Navbar
          resetSelection={resetSelection}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <main className="flex-grow container mx-auto px-6 py-28 relative z-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/browse" element={<BrowseStoriesPage />} />
            <Route
              path="/submit-story"
              element={
                <SubmitStoryForm
                  onCancel={() => window.history.back()}
                  onSubmitted={() => window.history.back()}
                />
              }
            />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pending"
              element={
                <ProtectedRoute>
                  <PendingStoriesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

    
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;
