# Instagram Follower Analyzer

A Next.js 13 web application that analyzes Instagram profiles to find users who don't follow back using **100% real Instagram data only**. Built with React, Tailwind CSS, and the App Router.

## Features

- 🔍 **100% Real Instagram Data**: Uses multiple Instagram API methods - no fake data generation
- 📊 **Statistics Dashboard**: View real follower counts, following counts, and non-follower percentages
- 🔍 **Search & Filter**: Search through non-followers by username or full name
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark Mode**: Beautiful dark theme with glass-morphism effects
- ⚡ **Caching**: 5-minute server-side cache for faster repeated requests
- 🎨 **Modern UI**: Smooth animations and hover effects
- 🛡️ **Authentic**: Only uses real Instagram APIs and web scraping - no fake data

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **APIs**: RapidAPI Instagram Scraper, Instagram Public API, Instagram GraphQL, Web Scraping
- **Styling**: Tailwind CSS with custom animations
- **Caching**: In-memory server cache with TTL

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- RapidAPI key (optional, for enhanced data)

### API Setup

#### RapidAPI Setup (Optional but Recommended)
1. Go to [RapidAPI Instagram Scraper](https://rapidapi.com/omarmhaimdat/api/instagram-scraper-2022)
2. Click "Subscribe to Test"
3. Choose a plan (Basic plan is sufficient for testing)
4. Get your API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd instagram-follower-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env.local file with your API keys
```

4. Configure your environment variables in `.env.local`:
```env
# RapidAPI Configuration (Optional)
RAPIDAPI_KEY=your_rapidapi_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter an Instagram username in the search field
2. Click "Analyze Profile" 
3. View the results showing:
   - Real profile information from Instagram
   - Actual follower/following statistics
   - List of users who don't follow back
4. Use the search feature to filter non-followers
5. Click "Load More" to see additional results

## API Endpoints

### POST /api/analyze-instagram

Analyzes an Instagram profile and returns follower data.

**Request Body:**
```json
{
  "username": "instagram_username"
}
```

**Response:**
```json
{
  "username": "instagram_username",
  "isPublic": true,
  "profileName": "Full Name",
  "bio": "Bio text",
  "profilePicUrl": "https://...",
  "website": "https://...",
  "postsCount": 123,
  "followersCount": 1000,
  "followingCount": 500,
  "followers": [...],
  "following": [...],
  "notFollowingBack": [...],
  "percentNotFollowingBack": 20
}
```

## How It Works

The application uses multiple real Instagram data sources to ensure reliable data fetching:

### Primary Method: Instagram Public API
- **Service**: Instagram's official public JSON endpoints
- **Data Available**: Full profile data, follower counts, following counts
- **Rate Limits**: Instagram's standard limits
- **Reliability**: High - official Instagram API

### Secondary Method: Instagram GraphQL API
- **Service**: Instagram's GraphQL endpoints
- **Data Available**: Profile data, followers, following lists
- **Rate Limits**: Instagram's standard limits
- **Reliability**: High - official Instagram API

### Tertiary Method: RapidAPI Instagram Scraper
- **Service**: RapidAPI Instagram Scraper 2022
- **Data Available**: Full profile data, followers, following lists
- **Rate Limits**: Varies by subscription plan
- **Reliability**: High - official API service

### Additional Methods: Web Scraping & Third-party Services
- **Services**: Socialblade, HypeAuditor, ScrapingBee, Bright Data
- **Data Available**: Profile statistics and follower counts
- **Rate Limits**: Varies by service
- **Reliability**: Medium - depends on service availability

## Error Handling

The application handles various error scenarios:

- **404**: User not found
- **429**: Rate limit reached (try again in 30 seconds)
- **Private Accounts**: Shows warning for private profiles
- **Network Errors**: Graceful fallback with retry options
- **API Key Errors**: Clear instructions for configuration

## Caching

- Server-side in-memory cache with 5-minute TTL
- Prevents repeated API calls for the same username
- Improves performance and reduces Instagram API load

## Rate Limits

- **RapidAPI**: Varies by subscription plan (typically 100-1000 requests/month)
- **Instagram Public API**: Instagram's standard rate limits
- **Application**: 5-minute caching to minimize API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This tool uses **100% real Instagram data** through official APIs and web scraping. No fake data is generated. Please respect Instagram's Terms of Service and rate limits when using this application. The application is for educational and personal use only. 