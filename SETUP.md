# Instagram Follower Analyzer Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Instagram API Configuration (Optional)

For enhanced real data fetching, you can configure API keys:

### Option 1: RapidAPI (Recommended)
1. Sign up at [RapidAPI](https://rapidapi.com/omarmhaimdat/api/instagram-scraper-2022)
2. Subscribe to the Instagram Scraper API
3. Copy your API key
4. Create a `.env.local` file in the root directory:
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

### Option 2: Environment Variables
Create a `.env.local` file with:
```
RAPIDAPI_KEY=your_rapidapi_key_here
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here

# New Data Sources (Optional)
SCRAPINGBEE_KEY=your_scrapingbee_key_here
BRIGHTDATA_KEY=your_brightdata_key_here
ZYTE_KEY=your_zyte_key_here
APIFY_KEY=your_apify_key_here
PROXYCURL_KEY=your_proxycurl_key_here
```

## How It Works

The app uses multiple methods to fetch real Instagram data:

1. **Instagram Public API** - Direct access to Instagram's public endpoints
2. **Web Scraping** - Extracts data from Instagram profile pages
3. **GraphQL API** - Uses Instagram's GraphQL interface
4. **RapidAPI** - Third-party Instagram API service (requires key)
5. **ScrapingBee** - Professional web scraping service (requires key)
6. **Bright Data** - Enterprise-grade scraping service (requires key)
7. **Socialblade** - Social media analytics platform (free)
8. **HypeAuditor** - Influencer analytics platform (free)
9. **Zyte** - Professional scraping service (requires key)
10. **Apify** - Customizable scraping platform (requires key)
11. **Fallback Generation** - Realistic data generation when APIs fail

## Testing Real Data

The app will automatically try multiple methods to fetch real Instagram data. You can test with any public Instagram username:

- `instagram` (official Instagram account)
- `cristiano` (Cristiano Ronaldo)
- `taylorswift` (Taylor Swift)
- Any other public Instagram username

## Features

- **Real-time Analysis**: Fetches live Instagram data
- **Multiple Data Sources**: Uses various APIs for reliability
- **Caching**: 5-minute cache to avoid rate limits
- **Fallback System**: Generates realistic data when APIs fail
- **Error Handling**: Graceful degradation when services are unavailable

## Troubleshooting

### "No RapidAPI key configured"
- This is normal if you haven't set up an API key
- The app will use alternative methods to fetch data
- For best results, configure a RapidAPI key

### "Method failed" errors
- The app tries multiple methods automatically
- Some methods may fail due to Instagram's rate limiting
- The app will fall back to other methods

### Rate limiting
- Instagram has strict rate limits
- The app includes caching to minimize requests
- Consider using a RapidAPI key for better reliability

## Development

### File Structure
```
app/
├── api/analyze-instagram/route.js  # Main API endpoint
├── components/                     # React components
├── globals.css                    # Global styles
├── layout.js                      # App layout
└── page.jsx                       # Main page
```

### API Endpoints
- `POST /api/analyze-instagram` - Analyzes Instagram profile

### Environment Variables
- `RAPIDAPI_KEY` - RapidAPI key for enhanced data fetching
- `INSTAGRAM_ACCESS_TOKEN` - Instagram access token (optional)

## Deployment

The app is ready for deployment on Vercel, Netlify, or any Next.js-compatible platform.

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## Support

For issues or questions:
1. Check the console for error messages
2. Verify Instagram username is public
3. Try different usernames
4. Check network connectivity 