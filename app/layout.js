import './globals.css'

export const metadata = {
  title: 'Instagram Follower Analyzer',
  description: 'Analyze who follows you back on Instagram',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen animated-gradient text-white">
        {children}
      </body>
    </html>
  )
} 