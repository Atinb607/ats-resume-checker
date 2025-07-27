"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, FileText, Sparkles, UserPlus, Check } from "lucide-react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import axios from "../api/axios"

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
    phone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === "password") setTouched(true)
  }

  const password = form.password

  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }

  const allValid = Object.values(rules).every(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allValid) return
    setIsLoading(true)

    try {
      await axios.post("/auth/signup", form)
      setMessage("✅ Signup successful! Redirecting...")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Signup failed. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo and Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/25">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Resume Forge
          </h1>
          <p className="text-gray-400 text-sm">Join thousands crafting perfect resumes</p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 transition-all duration-300 hover:shadow-purple-500/10 hover:shadow-2xl animate-slide-up"
        >
          <div className="flex items-center justify-center mb-6">
            <UserPlus className="w-5 h-5 text-purple-400 mr-2" />
            <h2 className="text-2xl font-semibold text-white">Create Account</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Username */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-500"
                required
              />
            </div>

            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Your full name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-500"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <div className="phone-input-dark">
              <PhoneInput
                country={"in"}
                enableSearch
                value={form.phone}
                onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: false,
                }}
                inputClass="!w-full !p-4 !pl-16 !bg-gray-900/50 !border !border-gray-600 !rounded-xl !text-white !placeholder-gray-400 focus:!outline-none focus:!ring-2 focus:!ring-purple-500 focus:!border-transparent !transition-all !duration-300"
                containerClass="w-full"
                buttonClass="!bg-gray-900/50 !border !border-gray-600 !rounded-l-xl hover:!bg-gray-800/50 !transition-all !duration-300"
                dropdownClass="!bg-gray-800 !border !border-gray-600 !rounded-xl !shadow-2xl"
                searchClass="!bg-gray-900 !border !border-gray-600 !text-white !placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-500"
              required
            />
          </div>

          {/* Password with Toggle */}
          <div className="mb-4 group">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-4 pr-12 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Rules */}
          {touched && (
            <div className="mb-6 p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 animate-fade-in">
              <p className="font-semibold mb-3 text-gray-300 text-sm">Password Requirements:</p>
              <div className="grid grid-cols-1 gap-2">
                <RuleItem isValid={rules.minLength} label="At least 8 characters" />
                <RuleItem isValid={rules.hasUpper} label="An uppercase letter (A-Z)" />
                <RuleItem isValid={rules.hasLower} label="A lowercase letter (a-z)" />
                <RuleItem isValid={rules.hasNumber} label="A number (0-9)" />
                <RuleItem isValid={rules.hasSpecial} label="A special character (!@#$...)" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!allValid || isLoading}
            className={`w-full p-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
              allValid && !isLoading
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-purple-500/25"
                : "bg-gray-600 text-gray-400 cursor-not-allowed shadow-gray-600/10"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Account
              </div>
            )}
          </button>

          {/* Login Link */}
          <p className="mt-6 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors duration-200 font-medium"
            >
              Sign In
            </a>
          </p>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center text-sm font-medium animate-fade-in ${
                message.includes("✅")
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-xs animate-fade-in-delay">
          <p>© 2024 Resume Forge. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.5s both;
        }

        /* Dark theme for phone input */
        .phone-input-dark .react-tel-input .country-list .country:hover {
          background-color: rgba(55, 65, 81, 0.5) !important;
        }
        
        .phone-input-dark .react-tel-input .country-list .country.highlight {
          background-color: rgba(147, 51, 234, 0.2) !important;
        }
        
        .phone-input-dark .react-tel-input .country-list .country-name {
          color: white !important;
        }
        
        .phone-input-dark .react-tel-input .country-list .dial-code {
          color: #9CA3AF !important;
        }
      `}</style>
    </div>
  )
}

// ✅ Rule display component
const RuleItem = ({ isValid, label }) => (
  <div className="flex items-center space-x-3 transition-all duration-300 ease-in-out">
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
        isValid ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/25" : "bg-gray-700 border-gray-600"
      }`}
    >
      {isValid && <Check size={12} className="text-white" />}
    </div>
    <span className={`text-sm transition-all duration-300 ${isValid ? "text-green-400" : "text-gray-400"}`}>
      {label}
    </span>
  </div>
)

export default Signup
