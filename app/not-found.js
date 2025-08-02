import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">404</h2>
        <h3 className="text-2xl font-semibold mb-4 text-white">
          Page Not Found
        </h3>
        <p className="text-gray-300 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
} 