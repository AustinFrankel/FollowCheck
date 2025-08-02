'use client'

import { useState } from 'react'

export default function MainComponent() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) return
    
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResults({
        username: username,
        profileName: username.charAt(0).toUpperCase() + username.slice(1),
        followersCount: Math.floor(Math.random() * 1000) + 100,
        followingCount: Math.floor(Math.random() * 500) + 50,
        postsCount: Math.floor(Math.random() * 100) + 10
      })
      setLoading(false)
    }, 2000)
  }

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
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 backdrop-blur-xl bg-white/5">
            {!loading && !results && (
              <form onSubmit={handleSubmit} className="space-y-8">
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Instagram username"
                      className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white/15 border-2 border-white/30 text-white placeholder-gray-300 focus:outline-none input-focus text-lg transition-all duration-300 hover:border-white/50"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={!username.trim() || loading}
                    className="px-8 py-4 rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 btn-gradient text-white uppercase tracking-wide shadow-2xl hover:shadow-3xl w-full max-w-md h-16 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Profile'}
                  </button>
                </div>
              </form>
            )}

            {/* Loading Animation */}
            {loading && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 animate-pulse">
                  <svg className="w-10 h-10 text-white animate-spin" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Analyzing Profile</h3>
                <p className="text-gray-200">Gathering Instagram data and analyzing relationships...</p>
              </div>
            )}

            {/* Results */}
            {results && !loading && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <button
                    onClick={() => {
                      setResults(null)
                      setUsername('')
                    }}
                    className="px-6 py-3 rounded-2xl font-bold transition-all duration-300 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
                  >
                    Back to Search
                  </button>
                </div>

                {/* Profile Info */}
                <div className="glass-card p-8 rounded-3xl border border-white/30 bg-white/5 backdrop-blur-xl">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full ring-4 ring-white/30 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{results.username.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2 text-white">{results.profileName}</h2>
                      <p className="text-xl text-gray-200 mb-3">@{results.username}</p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{results.followersCount}</div>
                      <div className="text-gray-200">Followers</div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{results.followingCount}</div>
                      <div className="text-gray-200">Following</div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">{results.postsCount}</div>
                      <div className="text-gray-200">Posts</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 