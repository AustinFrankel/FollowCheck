export default function StatsCard({ 
  icon, 
  value, 
  label, 
  secondaryLabel, 
  color = "blue",
  onClick,
  className = ""
}) {
  const colorClasses = {
    blue: "text-blue-300",
    green: "text-green-300", 
    red: "text-red-300",
    purple: "text-purple-300"
  }

  const bgGradients = {
    blue: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    green: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
    red: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
    purple: "bg-gradient-to-br from-purple-500/20 to-violet-500/20"
  }

  const iconBgGradients = {
    blue: "bg-gradient-to-br from-blue-500 to-cyan-500",
    green: "bg-gradient-to-br from-green-500 to-emerald-500",
    red: "bg-gradient-to-br from-red-500 to-pink-500",
    purple: "bg-gradient-to-br from-purple-500 to-violet-500"
  }

  return (
    <div 
      className={`glass-card p-6 rounded-3xl card-hover border border-white/20 ${bgGradients[color]} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl ${iconBgGradients[color]} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        {onClick && (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <div className={`text-4xl font-bold ${colorClasses[color]} mb-2`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-gray-300 font-semibold text-lg mb-1">{label}</div>
        {secondaryLabel && (
          <div className="text-sm text-gray-400 font-medium">{secondaryLabel}</div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full ${bgGradients[color]} rounded-full blur-xl`}></div>
      </div>
    </div>
  )
} 