export default function MainComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
              IA
            </div>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-white">Follower Analyzer</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-8">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              Instagram Follower Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-8 drop-shadow-lg">
              Discover who doesn't follow you back and analyze your Instagram relationships
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Instant analysis
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Privacy focused
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Real-time data
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 backdrop-blur-xl bg-white/5">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-white">Analyze Your Instagram Profile</h2>
                <p className="text-gray-200">Enter any Instagram username to discover who doesn't follow back</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Instagram username"
                    className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white/15 border-2 border-white/30 text-white placeholder-gray-300 focus:outline-none input-focus text-lg transition-all duration-300 hover:border-white/50"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  className="px-8 py-4 rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 btn-gradient text-white uppercase tracking-wide shadow-2xl hover:shadow-3xl w-full max-w-md h-16 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Analyze Profile
                </button>
              </div>

              {/* Sample Results */}
              <div className="mt-12 space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">Sample Analysis</h3>
                  <p className="text-gray-200">Here's what you'll see when you analyze a profile</p>
                </div>

                {/* Sample Profile Info */}
                <div className="glass-card p-8 rounded-3xl border border-white/30 bg-white/5 backdrop-blur-xl">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full ring-4 ring-white/30 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">I</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2 text-white">Instagram User</h2>
                      <p className="text-xl text-gray-200 mb-3">@instagram</p>
                    </div>
                  </div>
                </div>

                {/* Sample Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">1,234</div>
                      <div className="text-gray-200">Followers</div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">567</div>
                      <div className="text-gray-200">Following</div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">89</div>
                      <div className="text-gray-200">Posts</div>
                    </div>
                  </div>
                </div>

                {/* External Links */}
                <div className="glass-card p-8 rounded-3xl border border-white/30 bg-white/5 backdrop-blur-xl">
                  <h3 className="text-2xl font-bold mb-6 text-white">Real Instagram Data Sources</h3>
                  <p className="text-gray-200 mb-6">For complete follower analysis, visit these external services:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href="https://www.instagram.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 hover:to-purple-600/30 border border-white/20 hover:border-white/40 transition-all duration-300 group"
                    >
                      <svg className="w-6 h-6 text-pink-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-white font-medium group-hover:text-pink-200 transition-colors">Instagram Profile</span>
                    </a>
                    
                    <a 
                      href="https://socialblade.com/instagram/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-600/20 hover:from-blue-500/30 hover:to-cyan-600/30 border border-white/20 hover:border-white/40 transition-all duration-300 group"
                    >
                      <svg className="w-6 h-6 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-white font-medium group-hover:text-blue-200 transition-colors">Socialblade Stats</span>
                    </a>
                    
                    <a 
                      href="https://hypeauditor.com/analytics/instagram/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-600/30 border border-white/20 hover:border-white/40 transition-all duration-300 group"
                    >
                      <svg className="w-6 h-6 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 19c-4.3 0-8-1.79-8-4s3.7-4 8-4 8 1.79 8 4-3.7 4-8 4zM9 15c-2.8 0-6 1.46-6 2.5S6.2 20 9 20s6-1.46 6-2.5S11.8 15 9 15z"/>
                      </svg>
                      <span className="text-white font-medium group-hover:text-green-200 transition-colors">HypeAuditor Analytics</span>
                    </a>
                    
                    <a 
                      href="https://rapidapi.com/collection/instagram-apis" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-600/20 hover:from-purple-500/30 hover:to-indigo-600/30 border border-white/20 hover:border-white/40 transition-all duration-300 group"
                    >
                      <svg className="w-6 h-6 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-white font-medium group-hover:text-purple-200 transition-colors">RapidAPI Service</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 