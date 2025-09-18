import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { FileText, LogOut, PlusCircle } from "lucide-react";

const DashboardNavbar = ({ user }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const response = await api.get("/auth/user");
        const userData = response.data.user;
        setUsername(userData.username || userData.email.split("@")[0]);
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    };

    // Use passed user prop or fetch from API
    if (user) {
      setUsername(user.username || user.email.split("@")[0]);
    } else {
      fetchUser();
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCreateResume = () => {
    navigate("/coming-soon");
  };

  const handleHome = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <button
            onClick={handleHome}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Resume Forge
            </span>
          </button>

          {/* Right side - Actions and User */}
          <div className="flex items-center space-x-4">
            {/* Create Resume Button */}
            <button
              onClick={handleCreateResume}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Create Resume</span>
            </button>

            {/* Welcome Message */}
            <div className="hidden md:block text-gray-300">
              <span className="text-sm">Welcome, </span>
              <span className="font-medium text-white">{username || "User"}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
