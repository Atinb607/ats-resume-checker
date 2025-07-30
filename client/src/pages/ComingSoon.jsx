"use client"

import DashboardNavbar from "../components/DashboardNavbar"
import { Sparkles, Clock, Rocket, Zap, Target, Users } from "lucide-react"

const ComingSoon = () => {
  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Animated 3D-like shapes using CSS */}
        <div className="absolute inset-0 z-10">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-float-slow opacity-20"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 transform rotate-45 animate-float-medium opacity-25"></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg animate-float-fast opacity-15"></div>
          <div className="absolute bottom-20 right-20 w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full animate-float-slow opacity-20"></div>
          <div className="absolute top-1/2 left-10 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 transform rotate-12 animate-float-medium opacity-30"></div>
          <div className="absolute top-1/3 right-10 w-18 h-18 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg animate-float-fast opacity-25"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4 py-12">
          <div className="bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 max-w-2xl animate-fade-in-up">
            {/* Icon and Title */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg shadow-blue-500/25 animate-pulse-glow">
                <Rocket className="w-8 h-8 text-white animate-bounce-slow" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-text-glow">
                Coming Soon
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-xl mb-8 leading-relaxed animate-fade-in-delay">
              We're crafting something extraordinary for your resume building experience. Our AI-powered tools are being
              fine-tuned to perfection.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-800/50 backdrop-blur-sm hover:bg-blue-900/40 transition-all duration-300 animate-slide-in-left">
                <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2 animate-spin-slow" />
                <h3 className="text-white font-semibold mb-1">AI-Powered</h3>
                <p className="text-gray-400 text-sm">Smart resume optimization</p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-800/50 backdrop-blur-sm hover:bg-purple-900/40 transition-all duration-300 animate-slide-in-up">
                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2 animate-tick" />
                <h3 className="text-white font-semibold mb-1">Real-time</h3>
                <p className="text-gray-400 text-sm">Instant feedback & scoring</p>
              </div>
              <div className="p-4 bg-green-900/30 rounded-lg border border-green-800/50 backdrop-blur-sm hover:bg-green-900/40 transition-all duration-300 animate-slide-in-right">
                <Rocket className="w-6 h-6 text-green-400 mx-auto mb-2 animate-rocket" />
                <h3 className="text-white font-semibold mb-1">Modern</h3>
                <p className="text-gray-400 text-sm">Beautiful templates</p>
              </div>
            </div>

            {/* What's Coming Section */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-xl border border-gray-600/50 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-400 mr-2 animate-pulse" />
                <h2 className="text-2xl font-bold text-white">What's Coming</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">ATS Score Analysis</h4>
                    <p className="text-gray-400 text-xs">
                      Get detailed insights on how your resume performs with Applicant Tracking Systems
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">AI Resume Builder</h4>
                    <p className="text-gray-400 text-xs">
                      Create professional resumes with AI-powered suggestions and templates
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">Industry Insights</h4>
                    <p className="text-gray-400 text-xs">Get tailored advice based on your target industry and role</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">Real-time Optimization</h4>
                    <p className="text-gray-400 text-xs">Live feedback as you edit your resume for maximum impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <p className="text-gray-500 text-xs">© 2025 Resume Forge. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-15px) rotate(90deg) scale(1.1); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(45deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        }
        
        @keyframes text-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.6)); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes tick {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        @keyframes rocket {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out 0.2s both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out 0.6s both;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out 0.4s both;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-tick {
          animation: tick 2s ease-in-out infinite;
        }
        
        .animate-rocket {
          animation: rocket 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

export default ComingSoon
