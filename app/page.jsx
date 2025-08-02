'use client'

import { useState, useEffect } from 'react'
import Button from './components/Button'
import Navigation from './components/Navigation'
import StatsCard from './components/StatsCard'

export default function MainComponent() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [inputError, setInputError] = useState('')
  const [showInputError, setShowInputError] = useState(false)
  const [activeTab, setActiveTab] = useState('nonFollowers') // 'followers', 'following', 'nonFollowers'

  useEffect(() => {
    // Check for URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlUsername = urlParams.get('u')
    if (urlUsername) {
      setUsername(urlUsername)
      handleAnalyze(urlUsername)
    }
  }, [])

  const handleAnalyze = async (usernameToAnalyze = username) => {
    if (!usernameToAnalyze.trim()) {
      setShowInputError(true)
      setInputError('Please enter a username')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)
    setSearchTerm('')
    setInputError('')
    setShowInputError(false)
    setActiveTab('nonFollowers')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/analyze-instagram-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameToAnalyze }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Analysis failed. Please check the username and try again.')
        return
      }

      if (data.error) {
        setError(data.error)
        return
      }

      setResults(data)
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setShowInputError(true)
      setInputError('Please enter a username')
      const input = document.getElementById('username')
      input?.classList.add('shake')
      setTimeout(() => input?.classList.remove('shake'), 400)
      return
    }
    handleAnalyze(username)
  }

  const handleBackToSearch = () => {
    setResults(null)
    setError('')
    setSearchTerm('')
    setActiveTab('nonFollowers')
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRefreshAnalysis = () => {
    if (username.trim()) {
      handleAnalyze()
    }
  }

  const scrollToResults = () => {
    document.getElementById('results-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  const getFilteredUsers = () => {
    if (!results) return []
    
    let users = []
    switch (activeTab) {
      case 'followers':
        users = results.followers || []
        break
      case 'following':
        users = results.following || []
        break
      case 'nonFollowers':
        users = results.notFollowingBack || []
        break
      default:
        users = []
    }

    if (searchTerm) {
      return users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return users
  }

  const getTabCount = (tab) => {
    if (!results) return 0
    switch (tab) {
      case 'followers':
        return results.followers?.length || 0
      case 'following':
        return results.following?.length || 0
      case 'nonFollowers':
        return results.notFollowingBack?.length || 0
      default:
        return 0
    }
  }

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'followers':
        return 'Followers'
      case 'following':
        return 'Following'
      case 'nonFollowers':
        return "Don't Follow Back"
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <div className="relative pt-20 pb-8">
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
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                We fetch real Instagram data when possible. Profile information is always real.
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
              {/* Search Form */}
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
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value)
                          if (showInputError) {
                            setShowInputError(false)
                            setInputError('')
                          }
                        }}
                        placeholder="Enter Instagram username"
                        className={`w-full h-16 pl-14 pr-4 rounded-2xl bg-white/15 border-2 border-white/30 text-white placeholder-gray-300 focus:outline-none input-focus text-lg transition-all duration-300 ${showInputError ? 'border-red-400' : 'hover:border-white/50'}`}
                        disabled={loading}
                        aria-label="Instagram username"
                      />
                    </div>
                    {showInputError && (
                      <p className="text-red-400 text-sm mt-3 slide-in flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {inputError}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <Button
                      loading={loading}
                      disabled={!username.trim()}
                      className="w-full max-w-md h-16 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      type="submit"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Profile'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Error Banner */}
              {error && (
                <div className="slide-in bg-gradient-to-r from-red-500/20 to-pink-500/20 border-l-4 border-red-400 p-6 rounded-2xl mb-8 backdrop-blur-xl">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-red-200">Analysis Error</h3>
                      <p className="text-red-100">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading Animation */}
              {loading && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 animate-pulse">
                      <svg className="w-10 h-10 text-white animate-spin" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Analyzing Profile</h3>
                    <p className="text-gray-200">Gathering Instagram data and analyzing relationships...</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="glass-card p-6 rounded-2xl animate-pulse bg-white/5 border border-white/20">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl mb-4"></div>
                        <div className="h-8 bg-white/20 rounded mb-2"></div>
                        <div className="h-4 bg-white/10 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {results && !loading && (
                <div id="results-section" className="space-y-8">
                  {/* Navigation Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center mb-8">
                    <Button
                      onClick={handleBackToSearch}
                      variant="secondary"
                      className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to Search
                    </Button>
                    
                    <Button
                      onClick={handleRefreshAnalysis}
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Refresh Analysis
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="glass-card p-8 rounded-3xl border border-white/30 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-center space-x-6">
                      {results.profilePicUrl ? (
                        <div className="relative">
                          <img 
                            src={results.profilePicUrl} 
                            alt={results.profileName}
                            className="w-24 h-24 rounded-full ring-4 ring-white/30"
                            loading="lazy"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full ring-4 ring-white/30 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{results.username.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-2 text-white">{results.profileName}</h2>
                        <p className="text-xl text-gray-200 mb-3">@{results.username}</p>
                        {results.bio && (
                          <p className="text-gray-300 leading-relaxed">{results.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatsCard
                      icon={
                        <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                      }
                      value={results.followersCount}
                      label="Followers"
                      color="blue"
                      className="stagger-fade"
                      style={{ animationDelay: '0ms' }}
                    />
                    
                    <StatsCard
                      icon={
                        <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                      value={results.followingCount}
                      label="Following"
                      color="green"
                      className="stagger-fade"
                      style={{ animationDelay: '100ms' }}
                    />
                    
                    <StatsCard
                      icon={
                        <svg className="w-6 h-6 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                        </svg>
                      }
                      value={results.notFollowingBackCount || 0}
                      label="Don't Follow Back"
                      secondaryLabel={`${results.percentNotFollowingBack || 0}%`}
                      color="red"
                      onClick={scrollToResults}
                      className="stagger-fade cursor-pointer hover:scale-105 transition-transform"
                      style={{ animationDelay: '200ms' }}
                    />
                    
                    <StatsCard
                      icon={
                        <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      }
                      value={results.postsCount}
                      label="Posts"
                      color="purple"
                      className="stagger-fade"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>

                  {/* Analysis Summary */}
                  {results.analysis && (
                    <div className="glass-card p-8 rounded-3xl border border-white/30 bg-white/5 backdrop-blur-xl">
                      <h3 className="text-2xl font-bold mb-6 text-white">Analysis Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-400">{results.analysis.totalAnalyzed}</div>
                          <div className="text-gray-200">Total Analyzed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400">{results.analysis.followBackRate}%</div>
                          <div className="text-gray-200">Follow Back Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-400">{results.analysis.nonFollowers}</div>
                          <div className="text-gray-200">Don't Follow Back</div>
                        </div>
                      </div>
                      
                      {/* Data Source Indicator */}
                      {results.dataSource && (
                        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30">
                          <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-yellow-200 font-medium">
                              {results.dataSource === 'real' 
                                ? 'Real Instagram data' 
                                : results.dataSource === 'profile_only'
                                ? 'Real profile data (follower lists not available)'
                                : 'Sample data (Instagram API access limited)'
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* External Links Section */}
                  {results.externalLinks && (
                    <div className="glass-card p-8 rounded-3xl border border-white/30 bg-white/5 backdrop-blur-xl">
                      <h3 className="text-2xl font-bold mb-6 text-white">Real Instagram Data Sources</h3>
                      <p className="text-gray-200 mb-6">{results.externalLinks.message}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a 
                          href={results.externalLinks.instagramProfile} 
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
                          href={results.externalLinks.socialblade} 
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
                          href={results.externalLinks.hypeauditor} 
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
                          href={results.externalLinks.rapidapi} 
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
                  )}

                  {/* Private Account Warning */}
                  {!results.isPublic && (
                    <div className="glass-card p-8 rounded-3xl border border-yellow-400/50 slide-in bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-yellow-400">Private Account</h3>
                          <p className="text-gray-200">This account is private. Follower analysis is not available.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Lists Section */}
                  {results.isPublic && (
                    <div className="glass-card p-8 rounded-3xl border border-white/30 bg-white/5 backdrop-blur-xl">
                      {/* Tabs */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {[
                          { key: 'followers', label: 'Followers', color: 'blue' },
                          { key: 'following', label: 'Following', color: 'green' },
                          { key: 'nonFollowers', label: "Don't Follow Back", color: 'red' }
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => {
                              setActiveTab(tab.key)
                              setSearchTerm('')
                            }}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                              activeTab === tab.key
                                ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                                : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/20'
                            }`}
                          >
                            {tab.label} ({getTabCount(tab.key)})
                          </button>
                        ))}
                      </div>

                      {/* Search */}
                      <div className="mb-8">
                        <div className="relative max-w-md">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            placeholder={`Search ${getTabLabel(activeTab).toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 border border-white/30 text-white placeholder-gray-300 focus:outline-none input-focus"
                          />
                        </div>
                      </div>

                      {/* Results List */}
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        <div className="grid gap-4">
                          {getFilteredUsers().map((user, index) => (
                            <div key={`${user.username}-${index}`} className="glass-card p-6 rounded-2xl card-hover animate-slide-up border border-white/20 bg-white/5 backdrop-blur-xl" style={{ animationDelay: `${index * 50}ms` }}>
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <img 
                                    src={user.profilePicUrl} 
                                    alt={user.fullName}
                                    className="w-16 h-16 rounded-full ring-2 ring-white/30"
                                    loading="lazy"
                                  />
                                  {activeTab === 'nonFollowers' && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-lg truncate text-white">{user.fullName}</div>
                                  <div className="text-gray-300 truncate">@{user.username}</div>
                                </div>
                                <a
                                  href={user.profileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 transition-colors p-3 rounded-xl hover:bg-white/10"
                                  aria-label={`Visit ${user.username}'s profile`}
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Show total count for large lists */}
                        {getFilteredUsers().length > 100 && (
                          <div className="text-center text-gray-300 py-4 mt-4 border-t border-white/10">
                            <p className="text-sm">Showing {getFilteredUsers().length} of {getTabCount(activeTab)} {getTabLabel(activeTab).toLowerCase()}</p>
                          </div>
                        )}
                      </div>

                      {getFilteredUsers().length === 0 && searchTerm && (
                        <div className="text-center text-gray-300 py-12">
                          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                          <p className="text-lg text-white">No users found matching "{searchTerm}"</p>
                        </div>
                      )}

                      {getFilteredUsers().length === 0 && !searchTerm && (
                        <div className="text-center text-gray-300 py-12">
                          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          <p className="text-lg text-white">No {getTabLabel(activeTab).toLowerCase()} found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 