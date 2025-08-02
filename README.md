# Instagram Follower Analyzer

A beautiful, modern web application that analyzes Instagram profiles and provides follower insights. Built with Next.js, React, and Tailwind CSS.

## 🌟 Features

- **Real Instagram Data**: Fetches actual Instagram profile information
- **Beautiful UI**: Modern, responsive design with dark mode
- **Profile Analysis**: Shows followers, following, posts, and engagement metrics
- **External Links**: Direct links to Instagram analytics services
- **Static Deployment**: Works perfectly on GitHub Pages

## 🚀 Live Demo

Visit the live application: [Instagram Follower Analyzer](https://austinfrankel.github.io/FollowCheck/)

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AustinFrankel/FollowCheck.git
   cd FollowCheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory, perfect for GitHub Pages deployment.

## 🌐 GitHub Pages Deployment

The application is automatically deployed to GitHub Pages via GitHub Actions. The workflow:

1. **Triggers on push to main branch**
2. **Builds the Next.js application**
3. **Deploys to GitHub Pages**

### Manual Setup (if needed)

1. **Enable GitHub Pages** in your repository settings
2. **Set source to GitHub Actions**
3. **Push to main branch** - deployment happens automatically

## 🔧 Configuration

The application is configured for static export in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

## 📱 How It Works

1. **Enter Instagram Username**: Type any Instagram username
2. **Real Data Fetching**: Uses multiple methods to fetch Instagram profile data
3. **Profile Analysis**: Displays follower counts, engagement metrics
4. **External Services**: Links to Instagram analytics platforms

## 🛡️ Privacy & Security

- **No Data Storage**: All data is fetched in real-time
- **Client-Side Processing**: No server-side data storage
- **CORS-Safe**: Uses public APIs and CORS proxies
- **Transparent**: Clear indication of data sources

## 🎨 Technologies Used

- **Next.js 13**: React framework with App Router
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **GitHub Actions**: Automated deployment
- **GitHub Pages**: Static hosting

## 📊 Data Sources

The application uses multiple fallback methods to fetch Instagram data:

1. **Instagram Public API**: Direct API calls
2. **Web Scraping**: HTML parsing with CORS proxies
3. **External Services**: Links to analytics platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/AustinFrankel/FollowCheck/issues)
2. Create a new issue with details
3. Include browser console logs if applicable

---

**Note**: This application fetches public Instagram data for educational purposes. Respect Instagram's terms of service and privacy policies. 