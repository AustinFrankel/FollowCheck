# Instagram Follower Analyzer

A beautiful, modern web application to analyze Instagram follower relationships and discover who doesn't follow you back.

## Features

- 🔍 **Real Instagram Data**: Analyzes actual Instagram profiles using multiple data sources
- 👥 **Follower Analysis**: Shows detailed follower/following statistics
- 🚫 **Non-Followers Detection**: Identifies who doesn't follow you back
- 🎨 **Modern UI**: Beautiful glass morphism design with smooth animations
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ⚡ **Fast Performance**: Optimized with Next.js and Tailwind CSS
- 🔄 **Auto-Deploy**: Automatically deploys to GitHub Pages

## Live Demo

Visit: https://austinfrankel.github.io/FollowCheck/

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- **Next.js 13+** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **GitHub Actions** - Automated deployment
- **GitHub Pages** - Static hosting

## API Endpoints

- `/api/analyze-instagram` - Main Instagram analysis endpoint
- `/api/analyze-instagram-simple` - Simplified analysis endpoint
- `/api/test` - Test endpoint

## Data Sources

The application uses multiple data sources to ensure reliable Instagram data:

1. **Instagram Mobile API** - Primary data source
2. **Instagram Web Scraping** - Fallback method
3. **Social Media Analytics** - Third-party data sources
4. **RapidAPI Services** - Additional data providers

## Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the main branch.

## Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Next.js and Tailwind CSS 