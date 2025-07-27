"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../api/axios"
import { FileText, LogOut, PlusCircle } from "lucide-react"

const DashboardNavbar = () => {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) return navigate("/login")

      try {
        const res = await axios.get("/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsername(res.data.user.username || res.data.user.email.split("@")[0]) // Use email part if username not available
      } catch (err) {
        console.error("Failed to fetch user:", err.message)
        navigate("/login")
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg text-white px-6 py-4 flex justify-between items-center shadow-xl border-b border-gray-700/50 animate-fade-in-down">
      {/* Logo and Brand */}
      <Link to="/dashboard" className="flex items-center group">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Resume Forge
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        {/* Create Resume Button */}
        <Link
          to="/create-resume"
          className="hidden md:flex items-center bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-green-500/25 hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Resume
        </Link>

        {/* Welcome Message */}
        <span className="hidden sm:inline font-medium text-gray-300">
          Welcome, <span className="font-bold text-white">{username}</span>
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center bg-gray-700 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
      `}</style>
    </nav>
  )
}

export default DashboardNavbar
