export default function Button({ 
  onClick, 
  loading = false, 
  disabled = false, 
  children, 
  className = "",
  type = "button",
  variant = "primary"
}) {
  const baseClasses = "px-8 py-4 rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
  
  const variantClasses = {
    primary: "btn-gradient text-white uppercase tracking-wide shadow-2xl hover:shadow-3xl",
    secondary: "bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white backdrop-blur-xl",
    danger: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-2xl"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className}
        ${loading ? 'cursor-wait' : ''}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center transition-opacity duration-150">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg">Analyzing...</span>
        </div>
      ) : (
        <span className="text-lg">{children}</span>
      )}
    </button>
  )
} 