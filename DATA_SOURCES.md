# Instagram Data Sources Guide

This document outlines all the different methods available to fetch real Instagram data for the Instagram Follower Analyzer application.

## Current Data Sources

### 1. Instagram Public API
- **Endpoint**: `https://www.instagram.com/api/v1/users/web_profile_info/?username={username}`
- **Data Available**: Profile info, follower counts, following counts, posts count
- **Rate Limits**: Instagram's standard limits
- **Reliability**: Medium - may be rate limited
- **Setup**: No API key required

### 2. Instagram Web Scraping
- **Endpoint**: `https://www.instagram.com/{username}/`
- **Data Available**: Profile info, follower counts, following counts, posts count
- **Rate Limits**: Instagram's standard limits
- **Reliability**: Medium - may be blocked
- **Setup**: No API key required

### 3. Instagram GraphQL API
- **Endpoint**: `https://www.instagram.com/graphql/query/`
- **Data Available**: Profile info, follower counts, following counts, posts count
- **Rate Limits**: Instagram's standard limits
- **Reliability**: Medium - may be rate limited
- **Setup**: No API key required

### 4. RapidAPI Instagram Scraper
- **Endpoint**: `https://instagram-scraper-2022.p.rapidapi.com/userinfo/{username}`
- **Data Available**: Full profile data, followers, following lists
- **Rate Limits**: Varies by subscription plan (100-1000 requests/month)
- **Reliability**: High - official API service
- **Setup**: Requires RapidAPI key
- **Cost**: Free tier available, paid plans for more requests

## New Data Sources (Added)

### 5. ScrapingBee
- **Endpoint**: `https://app.scrapingbee.com/api/v1/`
- **Data Available**: Profile info, follower counts, following counts, posts count
- **Rate Limits**: 1000 requests/month (free), unlimited (paid)
- **Reliability**: High - professional web scraping service
- **Setup**: Requires ScrapingBee API key
- **Cost**: Free tier available, paid plans for more requests
- **Environment Variable**: `SCRAPINGBEE_KEY`

### 6. Bright Data
- **Endpoint**: `https://api.brightdata.com/scraper/instagram`
- **Data Available**: Full profile data, followers, following lists
- **Rate Limits**: Varies by plan
- **Reliability**: Very High - enterprise-grade scraping
- **Setup**: Requires Bright Data API key
- **Cost**: Paid service
- **Environment Variable**: `BRIGHTDATA_KEY`

### 7. Socialblade
- **Endpoint**: `https://socialblade.com/instagram/user/{username}/monthly`
- **Data Available**: Follower counts, following counts, posts count
- **Rate Limits**: Socialblade's standard limits
- **Reliability**: High - specialized in social media analytics
- **Setup**: No API key required
- **Cost**: Free
- **Note**: Only tracks public accounts

### 8. HypeAuditor
- **Endpoint**: `https://hypeauditor.com/instagram/{username}`
- **Data Available**: Follower counts, following counts, posts count
- **Rate Limits**: HypeAuditor's standard limits
- **Reliability**: High - specialized in influencer analytics
- **Setup**: No API key required
- **Cost**: Free
- **Note**: Only tracks public accounts

### 9. Zyte (formerly Scrapinghub)
- **Endpoint**: `https://app.zyte.com/api/v2/scraping/instagram/profile/{username}`
- **Data Available**: Full profile data, followers, following lists
- **Rate Limits**: Varies by plan
- **Reliability**: Very High - enterprise-grade scraping
- **Setup**: Requires Zyte API key
- **Cost**: Paid service
- **Environment Variable**: `ZYTE_KEY`

### 10. Apify
- **Endpoint**: `https://api.apify.com/v2/acts/{actor-id}/runs/last/dataset/items`
- **Data Available**: Full profile data, followers, following lists
- **Rate Limits**: Varies by plan
- **Reliability**: High - customizable scraping platform
- **Setup**: Requires Apify API key and actor setup
- **Cost**: Free tier available, paid plans for more requests
- **Environment Variable**: `APIFY_KEY`

## Additional Data Sources (Not Yet Implemented)

### 11. Proxycurl
- **Endpoint**: `https://nubela.co/proxycurl/api/v2/`
- **Data Available**: Limited profile data
- **Rate Limits**: Varies by plan
- **Reliability**: Medium - primarily for LinkedIn
- **Setup**: Requires Proxycurl API key
- **Cost**: Paid service
- **Environment Variable**: `PROXYCURL_KEY`
- **Note**: Limited Instagram support

### 12. Alternative Instagram APIs
- **Instagram Basic Display API**: Requires app approval from Meta
- **Instagram Graph API**: Requires business account and app approval
- **Third-party Instagram APIs**: Various services with different capabilities

## Social Media Analytics Platforms

### 13. Influencer Analytics Services
- **InfluencerDB**: `https://influencerdb.com/instagram/{username}`
- **Upfluence**: `https://upfluence.com/instagram/{username}`
- **NeoReach**: `https://neoreach.com/instagram/{username}`
- **Klear**: `https://klear.com/instagram/{username}`

### 14. Social Media Monitoring Tools
- **Brand24**: Social media monitoring with Instagram data
- **Mention**: Social media monitoring with Instagram data
- **Awario**: Social media monitoring with Instagram data

## Web Scraping Services

### 15. Professional Scraping Services
- **ScraperAPI**: `https://www.scraperapi.com/`
- **ZenRows**: `https://zenrows.com/`
- **ScrapingAnt**: `https://scrapingant.com/`
- **Scrapestack**: `https://scrapestack.com/`

### 16. Browser Automation Services
- **Puppeteer**: Node.js library for browser automation
- **Playwright**: Microsoft's browser automation library
- **Selenium**: Web browser automation
- **Browserless**: Cloud-based browser automation

## Data Aggregation Services

### 17. Social Media Data Providers
- **Brandwatch**: Social media listening and analytics
- **Sprinklr**: Social media management with data
- **Hootsuite**: Social media management with analytics
- **Buffer**: Social media management with insights

### 18. API Aggregation Services
- **RapidAPI**: Multiple Instagram APIs available
- **APILayer**: Various social media APIs
- **Zapier**: Workflow automation with social media data
- **IFTTT**: Applet automation with social media data

## Setup Instructions

### Environment Variables
Add these to your `.env.local` file:

```env
# Existing
RAPIDAPI_KEY=your_rapidapi_key_here

# New Sources
SCRAPINGBEE_KEY=your_scrapingbee_key_here
BRIGHTDATA_KEY=your_brightdata_key_here
ZYTE_KEY=your_zyte_key_here
APIFY_KEY=your_apify_key_here
PROXYCURL_KEY=your_proxycurl_key_here
```

### API Key Setup

#### ScrapingBee
1. Sign up at [ScrapingBee](https://www.scrapingbee.com/)
2. Get your API key from the dashboard
3. Add to environment variables

#### Bright Data
1. Sign up at [Bright Data](https://brightdata.com/)
2. Create a scraping project
3. Get your API key from the dashboard
4. Add to environment variables

#### Zyte
1. Sign up at [Zyte](https://www.zyte.com/)
2. Create a scraping project
3. Get your API key from the dashboard
4. Add to environment variables

#### Apify
1. Sign up at [Apify](https://apify.com/)
2. Create or find an Instagram scraping actor
3. Get your API key from the dashboard
4. Add to environment variables

## Cost Comparison

| Service | Free Tier | Paid Plans | Best For |
|---------|-----------|------------|----------|
| RapidAPI | 100 req/month | $10-50/month | Quick setup |
| ScrapingBee | 1000 req/month | $29-199/month | Reliable scraping |
| Bright Data | None | $500+/month | Enterprise |
| Socialblade | Unlimited | None | Public accounts only |
| HypeAuditor | Limited | $99+/month | Influencer analytics |
| Zyte | None | $25+/month | Professional scraping |
| Apify | 1000 compute units | $49+/month | Custom scraping |

## Reliability Ranking

1. **Bright Data** - Enterprise-grade, most reliable
2. **Zyte** - Professional scraping service
3. **RapidAPI** - Official API service
4. **ScrapingBee** - Reliable web scraping
5. **Apify** - Customizable but requires setup
6. **Socialblade** - Free but limited data
7. **HypeAuditor** - Good for public accounts
8. **Instagram Public API** - Rate limited
9. **Web Scraping** - May be blocked
10. **GraphQL API** - Rate limited

## Recommendations

### For Development/Testing
- Use **Socialblade** and **HypeAuditor** (free)
- Use **RapidAPI** free tier
- Use **ScrapingBee** free tier

### For Production
- Use **Bright Data** or **Zyte** for reliability
- Combine multiple sources for redundancy
- Implement proper caching and rate limiting

### For Cost-Effective Solution
- Use **ScrapingBee** paid plan
- Use **Apify** with custom actors
- Combine free sources with paid ones

## Implementation Notes

- All new sources are automatically tried in order
- If one fails, the next is attempted
- Fallback to generated data if all real sources fail
- 5-minute caching prevents repeated API calls
- Error handling ensures graceful degradation 