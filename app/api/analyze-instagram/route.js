import { NextResponse } from 'next/server'

// In-memory cache with TTL
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// API configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET

async function handler({ username }) {
  // Validate input
  if (!username || username.trim() === '') {
    return { error: "Username is required" }
  }

  // Normalize username
  const cleanUsername = username.replace('@', '').trim().toLowerCase()

  // Check cache
  const cached = cache.get(cleanUsername)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    // Real Instagram data analysis with timeout
    const userData = await Promise.race([
      analyzeInstagramProfile(cleanUsername),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 45000)
      )
    ])
    
    if (userData) {
      // Cache the result
      cache.set(cleanUsername, { data: userData, timestamp: Date.now() })
      return userData
    }

    return { 
      error: "Unable to fetch Instagram data. This could be due to:\n• The profile is private\n• The username is incorrect\n• Instagram is temporarily blocking requests\n• Network connectivity issues\n\nPlease check the username and try again in a few minutes." 
    }

  } catch (error) {
    console.error('Analysis error:', error)
    return { 
      error: "Analysis failed. Please check the username and try again. If the problem persists, the profile may be private or Instagram may be temporarily blocking requests." 
    }
  }
}

async function analyzeInstagramProfile(username) {
  try {
    // Get profile data using Instagram's public API
    const profileData = await fetchInstagramProfileData(username)
    
    if (!profileData) {
      return null
    }

    // Get real follower data
    const followerData = await fetchRealFollowerData(username, profileData)
    
    return {
      username: username,
      isPublic: profileData.isPublic,
      profileName: profileData.profileName,
      bio: profileData.bio,
      profilePicUrl: profileData.profilePicUrl,
      website: profileData.website,
      postsCount: profileData.postsCount,
      followersCount: profileData.followersCount,
      followingCount: profileData.followingCount,
      notFollowingBackCount: followerData.notFollowingBackCount,
      percentNotFollowingBack: followerData.percentNotFollowingBack,
      followers: followerData.followers,
      following: followerData.following,
      notFollowingBack: followerData.notFollowingBack,
      dataSource: followerData.dataSource,
      analysis: {
        totalAnalyzed: followerData.followingCount || profileData.followingCount || 0,
        mutualFollowers: followerData.followersCount || profileData.followersCount || 0,
        nonFollowers: followerData.notFollowingBackCount || 0,
        followBackRate: followerData.followBackRate || 0
      }
    }
  } catch (error) {
    console.error('Instagram analysis error:', error)
    
    // If we have profile data but follower analysis failed, return basic profile
    if (profileData) {
      return {
        username: username,
        isPublic: profileData.isPublic,
        profileName: profileData.profileName,
        bio: profileData.bio,
        profilePicUrl: profileData.profilePicUrl,
        website: profileData.website,
        postsCount: profileData.postsCount,
        followersCount: profileData.followersCount,
        followingCount: profileData.followingCount,
        notFollowingBackCount: 0,
        percentNotFollowingBack: 0,
        followers: [],
        following: [],
        notFollowingBack: [],
        dataSource: 'profile_only',
        analysis: {
          totalAnalyzed: 0,
          mutualFollowers: profileData.followersCount || 0,
          nonFollowers: 0,
          followBackRate: 0
        }
      }
    }
    
    return null
  }
}

async function fetchInstagramProfileData(username) {
  // Try multiple methods to get profile data with better error handling
  const methods = [
    () => fetchInstagramPublicAPI(username), // Mobile API first
    () => fetchInstagramDataFromBasicFallback(username),
    () => fetchInstagramDataFromDirectScraping(username),
    () => fetchInstagramDataFromAlternativeScraping(username),
    () => fetchInstagramWithSession(username),
    () => fetchInstagramGraphQL(username),
    () => fetchInstagramDataFromSocialblade(username),
    () => fetchInstagramDataFromHypeAuditor(username),
    () => fetchInstagramRapidAPI(username),
    () => fetchInstagramDataFromScrapingBee(username),
    () => fetchInstagramDataFromBrightData(username),
    () => fetchInstagramDataFromZyte(username),
    () => fetchInstagramDataFromApify(username)
  ]

  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`Trying method ${i + 1} for username: ${username}`)
      const data = await methods[i]()
      if (data && data.profileName && data.followersCount >= 0) {
        console.log(`Successfully fetched REAL data using method ${i + 1}`)
        return data
      }
    } catch (error) {
      console.error(`Method ${i + 1} failed:`, error.message)
      continue
    }
  }

  // All real data methods failed
  console.log('All real data methods failed')
  return null
}

async function fetchInstagramWithSession(username) {
  try {
    // First get a session from Instagram
    const sessionResponse = await fetch('https://www.instagram.com/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    })

    const cookies = sessionResponse.headers.get('set-cookie') || ''
    
    // Now use the session to get user data
    const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Cookie': cookies
      },
      timeout: 10000
    })

    if (!response.ok) {
      throw new Error(`Instagram session API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.data && data.data.user) {
      const user = data.data.user
      return {
        isPublic: !user.is_private,
        profileName: user.full_name || username,
        bio: user.biography || '',
        profilePicUrl: user.profile_pic_url || '',
        website: user.external_url || '',
        postsCount: user.edge_owner_to_timeline_media?.count || 0,
        followersCount: user.edge_followed_by?.count || 0,
        followingCount: user.edge_follow?.count || 0,
        userId: user.id
      }
    }
    
    throw new Error('No user data found in Instagram session API response')
  } catch (error) {
    console.error('Instagram session API error:', error.message)
    throw error
  }
}

async function fetchInstagramPublicAPI(username) {
  try {
    console.log(`Attempting mobile API for ${username}`)
    
    // Use Instagram's mobile app API endpoint
    const response = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Instagram 155.0.0.37.107',
        'X-IG-App-ID': '936619743392459',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      timeout: 15000
    })

    // Check content type to ensure we got JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Received HTML instead of JSON:', text.substring(0, 200))
      throw new Error('Received HTML instead of JSON response')
    }

    if (!response.ok) {
      throw new Error(`Instagram mobile API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.data && data.data.user) {
      const user = data.data.user
      console.log(`Successfully fetched mobile API data for ${username}`)
      return {
        isPublic: !user.is_private,
        profileName: user.full_name || username,
        bio: user.biography || '',
        profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || '',
        website: user.external_url || '',
        postsCount: user.edge_owner_to_timeline_media?.count || 0,
        followersCount: user.edge_followed_by?.count || 0,
        followingCount: user.edge_follow?.count || 0,
        userId: user.id
      }
    }
    
    throw new Error('No user data found in Instagram mobile API response')
  } catch (error) {
    console.error('Instagram mobile API error:', error.message)
    throw error
  }
}

async function fetchInstagramGraphQL(username) {
  try {
    // Try Instagram's GraphQL endpoint with updated query
    const response = await fetch(`https://www.instagram.com/graphql/query/`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      body: new URLSearchParams({
        query_hash: 'c9100bf9110dd6361671f113dd02e7d6',
        variables: JSON.stringify({
          username: username,
          first: 1
        })
      }),
      timeout: 10000
    })

    if (!response.ok) {
      throw new Error(`Instagram GraphQL request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.data && data.data.user) {
      const user = data.data.user
      return {
        isPublic: !user.is_private,
        profileName: user.full_name || username,
        bio: user.biography || '',
        profilePicUrl: user.profile_pic_url || '',
        website: user.external_url || '',
        postsCount: user.edge_owner_to_timeline_media?.count || 0,
        followersCount: user.edge_followed_by?.count || 0,
        followingCount: user.edge_follow?.count || 0
      }
    }
    
    throw new Error('No user data found in Instagram GraphQL response')
  } catch (error) {
    console.error('Instagram GraphQL error:', error.message)
    throw error
  }
}

async function fetchInstagramRapidAPI(username) {
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your_rapidapi_key_here') {
    console.log('RapidAPI key not configured, skipping')
    return null
  }

  const response = await fetch(`https://instagram-scraper-2022.p.rapidapi.com/userinfo/${username}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
    },
    timeout: 10000
  })

  if (!response.ok) {
    throw new Error(`RapidAPI request failed: ${response.status}`)
  }

  const data = await response.json()
  
  if (data && data.user) {
    return {
      isPublic: !data.user.is_private,
      profileName: data.user.full_name || username,
      bio: data.user.biography || '',
      profilePicUrl: data.user.profile_pic_url || '',
      website: data.user.external_url || '',
      postsCount: data.user.media_count || 0,
      followersCount: data.user.follower_count || 0,
      followingCount: data.user.following_count || 0
    }
  }
  
  throw new Error('No user data found in RapidAPI response')
}

// NEW: Additional Instagram data sources
async function fetchInstagramDataFromScrapingBee(username) {
  const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY
  if (!SCRAPINGBEE_KEY) {
    console.log('ScrapingBee key not configured, skipping')
    return null
  }

  try {
    const response = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_KEY}&url=https://www.instagram.com/${username}/&render_js=false&premium_proxy=true&country_code=us`, {
      method: 'GET',
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`ScrapingBee request failed: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract data from the HTML using regex patterns
    const followersMatch = html.match(/"edge_followed_by":{"count":(\d+)}/)
    const followingMatch = html.match(/"edge_follow":{"count":(\d+)}/)
    const postsMatch = html.match(/"edge_owner_to_timeline_media":{"count":(\d+)}/)
    const fullNameMatch = html.match(/"full_name":"([^"]+)"/)
    const bioMatch = html.match(/"biography":"([^"]*)"/)
    const isPrivateMatch = html.match(/"is_private":(\w+)/)
    const profilePicMatch = html.match(/"profile_pic_url":"([^"]+)"/)
    const externalUrlMatch = html.match(/"external_url":"([^"]*)"/)

    if (followersMatch || followingMatch || postsMatch) {
      return {
        isPublic: !(isPrivateMatch && isPrivateMatch[1] === 'true'),
        profileName: fullNameMatch ? fullNameMatch[1] : username,
        bio: bioMatch ? bioMatch[1] : '',
        profilePicUrl: profilePicMatch ? profilePicMatch[1] : '',
        website: externalUrlMatch ? externalUrlMatch[1] : '',
        postsCount: postsMatch ? parseInt(postsMatch[1]) : 0,
        followersCount: followersMatch ? parseInt(followersMatch[1]) : 0,
        followingCount: followingMatch ? parseInt(followingMatch[1]) : 0
      }
    }
    
    throw new Error('Could not extract data from Instagram page via ScrapingBee')
  } catch (error) {
    console.error('ScrapingBee error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromBrightData(username) {
  const BRIGHTDATA_KEY = process.env.BRIGHTDATA_KEY
  if (!BRIGHTDATA_KEY) {
    console.log('Bright Data key not configured, skipping')
    return null
  }

  try {
    const response = await fetch(`https://api.brightdata.com/scraper/instagram?username=${username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BRIGHTDATA_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`Bright Data request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.user) {
      return {
        isPublic: !data.user.is_private,
        profileName: data.user.full_name || username,
        bio: data.user.biography || '',
        profilePicUrl: data.user.profile_pic_url || '',
        website: data.user.external_url || '',
        postsCount: data.user.media_count || 0,
        followersCount: data.user.follower_count || 0,
        followingCount: data.user.following_count || 0
      }
    }
    
    throw new Error('No user data found in Bright Data response')
  } catch (error) {
    console.error('Bright Data error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromSocialblade(username) {
  try {
    const response = await fetch(`https://socialblade.com/instagram/user/${username}/monthly`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`Socialblade request failed: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract follower count from Socialblade
    const followerMatch = html.match(/Followers<\/div><div[^>]*>([\d,]+)/)
    const followingMatch = html.match(/Following<\/div><div[^>]*>([\d,]+)/)
    const postsMatch = html.match(/Posts<\/div><div[^>]*>([\d,]+)/)
    
    if (followerMatch) {
      const followersCount = parseInt(followerMatch[1].replace(/,/g, ''))
      const followingCount = followingMatch ? parseInt(followingMatch[1].replace(/,/g, '')) : 0
      const postsCount = postsMatch ? parseInt(postsMatch[1].replace(/,/g, '')) : 0
      
      return {
        isPublic: true, // Socialblade only tracks public accounts
        profileName: username,
        bio: '',
        profilePicUrl: '',
        website: '',
        postsCount: postsCount,
        followersCount: followersCount,
        followingCount: followingCount
      }
    }
    
    throw new Error('Could not extract data from Socialblade')
  } catch (error) {
    console.error('Socialblade error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromHypeAuditor(username) {
  try {
    const response = await fetch(`https://hypeauditor.com/instagram/${username}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`HypeAuditor request failed: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract data from HypeAuditor
    const followerMatch = html.match(/"followers":\s*(\d+)/)
    const followingMatch = html.match(/"following":\s*(\d+)/)
    const postsMatch = html.match(/"posts":\s*(\d+)/)
    
    if (followerMatch) {
      return {
        isPublic: true,
        profileName: username,
        bio: '',
        profilePicUrl: '',
        website: '',
        postsCount: postsMatch ? parseInt(postsMatch[1]) : 0,
        followersCount: parseInt(followerMatch[1]),
        followingCount: followingMatch ? parseInt(followingMatch[1]) : 0
      }
    }
    
    throw new Error('Could not extract data from HypeAuditor')
  } catch (error) {
    console.error('HypeAuditor error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromZyte(username) {
  const ZYTE_KEY = process.env.ZYTE_KEY
  if (!ZYTE_KEY) {
    console.log('Zyte key not configured, skipping')
    return null
  }

  try {
    const response = await fetch(`https://app.zyte.com/api/v2/scraping/instagram/profile/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ZYTE_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`Zyte request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.profile) {
      return {
        isPublic: !data.profile.is_private,
        profileName: data.profile.full_name || username,
        bio: data.profile.biography || '',
        profilePicUrl: data.profile.profile_pic_url || '',
        website: data.profile.external_url || '',
        postsCount: data.profile.media_count || 0,
        followersCount: data.profile.follower_count || 0,
        followingCount: data.profile.following_count || 0
      }
    }
    
    throw new Error('No user data found in Zyte response')
  } catch (error) {
    console.error('Zyte error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromApify(username) {
  const APIFY_KEY = process.env.APIFY_KEY
  if (!APIFY_KEY) {
    console.log('Apify key not configured, skipping')
    return null
  }

  try {
    const response = await fetch(`https://api.apify.com/v2/acts/your-actor-id/runs/last/dataset/items?token=${APIFY_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`Apify request failed: ${response.status}`)
    }

    const data = await response.json()
    
    // Find the user data in the response
    const userData = data.find(item => item.username === username)
    
    if (userData) {
      return {
        isPublic: !userData.is_private,
        profileName: userData.full_name || username,
        bio: userData.biography || '',
        profilePicUrl: userData.profile_pic_url || '',
        website: userData.external_url || '',
        postsCount: userData.media_count || 0,
        followersCount: userData.follower_count || 0,
        followingCount: userData.following_count || 0
      }
    }
    
    throw new Error('No user data found in Apify response')
  } catch (error) {
    console.error('Apify error:', error.message)
    throw error
  }
}

// Fake data generation functions removed - only real API data will be used

async function fetchInstagramDataFromDirectScraping(username) {
  try {
    console.log(`Attempting direct scraping for ${username}`)
    
    // Get session first
    const sessionResponse = await fetch('https://www.instagram.com/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      }
    })

    const cookies = sessionResponse.headers.get('set-cookie') || ''
    
    // Direct scraping of Instagram profile page
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'Cookie': cookies
      },
      timeout: 25000
    })

    if (!response.ok) {
      throw new Error(`Direct scraping failed: ${response.status}`)
    }

    const html = await response.text()
    console.log(`Direct scraping HTML length: ${html.length}`)
    
    // Try multiple extraction patterns
    const patterns = [
      // Pattern 1: Modern Instagram structure
      {
        followers: /"edge_followed_by":\s*{\s*"count":\s*(\d+)/,
        following: /"edge_follow":\s*{\s*"count":\s*(\d+)/,
        posts: /"edge_owner_to_timeline_media":\s*{\s*"count":\s*(\d+)/,
        fullName: /"full_name":\s*"([^"]+)"/,
        bio: /"biography":\s*"([^"]*)"/,
        isPrivate: /"is_private":\s*(true|false)/,
        profilePic: /"profile_pic_url":\s*"([^"]+)"/,
        website: /"external_url":\s*"([^"]*)"/,
      },
      // Pattern 2: Alternative structure
      {
        followers: /"followers_count":\s*(\d+)/,
        following: /"following_count":\s*(\d+)/,
        posts: /"media_count":\s*(\d+)/,
        fullName: /"full_name":\s*"([^"]+)"/,
        bio: /"biography":\s*"([^"]*)"/,
        isPrivate: /"is_private":\s*(true|false)/,
        profilePic: /"profile_pic_url":\s*"([^"]+)"/,
        website: /"external_url":\s*"([^"]*)"/,
      },
      // Pattern 3: Simple patterns
      {
        followers: /"followers":\s*(\d+)/,
        following: /"following":\s*(\d+)/,
        posts: /"posts":\s*(\d+)/,
        fullName: /"full_name":\s*"([^"]+)"/,
        bio: /"biography":\s*"([^"]*)"/,
        isPrivate: /"is_private":\s*(true|false)/,
        profilePic: /"profile_pic_url":\s*"([^"]+)"/,
        website: /"external_url":\s*"([^"]*)"/,
      }
    ]

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      const followersMatch = html.match(pattern.followers)
      const followingMatch = html.match(pattern.following)
      const postsMatch = html.match(pattern.posts)
      const fullNameMatch = html.match(pattern.fullName)
      const bioMatch = html.match(pattern.bio)
      const isPrivateMatch = html.match(pattern.isPrivate)
      const profilePicMatch = html.match(pattern.profilePic)
      const websiteMatch = html.match(pattern.website)

      if (followersMatch || followingMatch || postsMatch) {
        const followersCount = followersMatch ? parseInt(followersMatch[1]) : 0
        const followingCount = followingMatch ? parseInt(followingMatch[1]) : 0
        const postsCount = postsMatch ? parseInt(postsMatch[1]) : 0

        console.log(`Pattern ${i + 1} extracted: followers=${followersCount}, following=${followingCount}, posts=${postsCount}`)
  
  return {
          isPublic: !(isPrivateMatch && isPrivateMatch[1] === 'true'),
          profileName: fullNameMatch ? fullNameMatch[1] : username,
          bio: bioMatch ? bioMatch[1] : '',
          profilePicUrl: profilePicMatch ? profilePicMatch[1] : '',
          website: websiteMatch ? websiteMatch[1] : '',
    postsCount: postsCount,
    followersCount: followersCount,
    followingCount: followingCount
        }
      }
    }
    
    throw new Error('Could not extract data from Instagram page via direct scraping')
  } catch (error) {
    console.error('Direct scraping error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromAlternativeScraping(username) {
  try {
    console.log(`Attempting alternative scraping for ${username}`)
    
    // Try with different user agent and headers
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 25000
    })

    if (!response.ok) {
      throw new Error(`Alternative scraping failed: ${response.status}`)
    }

    const html = await response.text()
    console.log(`Alternative scraping HTML length: ${html.length}`)
    
    // Try to find JSON data in script tags
    const scriptMatches = html.match(/<script[^>]*type="application\/json"[^>]*>(.*?)<\/script>/g)
    if (scriptMatches) {
      for (const scriptMatch of scriptMatches) {
        try {
          const jsonMatch = scriptMatch.match(/<script[^>]*type="application\/json"[^>]*>(.*?)<\/script>/)
          if (jsonMatch) {
            const scriptData = JSON.parse(jsonMatch[1])
            if (scriptData.entry_data && scriptData.entry_data.ProfilePage) {
              const user = scriptData.entry_data.ProfilePage[0].graphql.user
              
              return {
                isPublic: !user.is_private,
                profileName: user.full_name || username,
                bio: user.biography || '',
                profilePicUrl: user.profile_pic_url || '',
                website: user.external_url || '',
                postsCount: user.edge_owner_to_timeline_media?.count || 0,
                followersCount: user.edge_followed_by?.count || 0,
                followingCount: user.edge_follow?.count || 0
              }
            }
          }
        } catch (parseError) {
          console.error('Failed to parse script data:', parseError)
        }
      }
    }
    
    // Try to extract from window._sharedData
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/)
    if (sharedDataMatch) {
      try {
        const userData = JSON.parse(sharedDataMatch[1])
        const user = userData.entry_data.ProfilePage[0].graphql.user
        
        return {
          isPublic: !user.is_private,
          profileName: user.full_name || username,
          bio: user.biography || '',
          profilePicUrl: user.profile_pic_url || '',
          website: user.external_url || '',
          postsCount: user.edge_owner_to_timeline_media?.count || 0,
          followersCount: user.edge_followed_by?.count || 0,
          followingCount: user.edge_follow?.count || 0
        }
      } catch (parseError) {
        console.error('Failed to parse _sharedData:', parseError)
      }
    }
    
    // Try to extract from additional_data
    const additionalDataMatch = html.match(/window\.__additionalDataLoaded\s*\(\s*'[^']+'\s*,\s*({.+?})\s*\)/)
    if (additionalDataMatch) {
      try {
        const additionalData = JSON.parse(additionalDataMatch[1])
        if (additionalData.graphql && additionalData.graphql.user) {
          const user = additionalData.graphql.user
          
          return {
            isPublic: !user.is_private,
            profileName: user.full_name || username,
            bio: user.biography || '',
            profilePicUrl: user.profile_pic_url || '',
            website: user.external_url || '',
            postsCount: user.edge_owner_to_timeline_media?.count || 0,
            followersCount: user.edge_followed_by?.count || 0,
            followingCount: user.edge_follow?.count || 0
          }
        }
      } catch (parseError) {
        console.error('Failed to parse additional_data:', parseError)
      }
    }
    
    throw new Error('Could not extract data from Instagram page via alternative scraping')
  } catch (error) {
    console.error('Alternative scraping error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromBasicFallback(username) {
  try {
    console.log(`Attempting basic fallback for ${username}`)
    
    // Use a more robust approach with better headers and session handling
    const sessionResponse = await fetch('https://www.instagram.com/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      }
    })

    const cookies = sessionResponse.headers.get('set-cookie') || ''
    
    // Try the API with better headers
    const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Cookie': cookies
      },
      timeout: 30000
    })

    if (response.ok) {
      const data = await response.json()
      
      if (data && data.data && data.data.user) {
        const user = data.data.user
        return {
          isPublic: !user.is_private,
          profileName: user.full_name || username,
          bio: user.biography || '',
          profilePicUrl: user.profile_pic_url || '',
          website: user.external_url || '',
          postsCount: user.edge_owner_to_timeline_media?.count || 0,
          followersCount: user.edge_followed_by?.count || 0,
          followingCount: user.edge_follow?.count || 0,
          userId: user.id
        }
      }
    }
    
    // If API fails, try to extract from the profile page HTML
    const profileResponse = await fetch(`https://www.instagram.com/${username}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'Cookie': cookies
      },
      timeout: 30000
    })

    if (profileResponse.ok) {
      const html = await profileResponse.text()
      
      // Try to extract data from the HTML using multiple patterns
      const patterns = [
        // Pattern 1: Modern Instagram structure
        {
          followers: /"edge_followed_by":\s*{\s*"count":\s*(\d+)/,
          following: /"edge_follow":\s*{\s*"count":\s*(\d+)/,
          posts: /"edge_owner_to_timeline_media":\s*{\s*"count":\s*(\d+)/,
          fullName: /"full_name":\s*"([^"]+)"/,
          bio: /"biography":\s*"([^"]*)"/,
          isPrivate: /"is_private":\s*(true|false)/,
          profilePic: /"profile_pic_url":\s*"([^"]+)"/,
          website: /"external_url":\s*"([^"]*)"/,
        },
        // Pattern 2: Alternative structure
        {
          followers: /"followers_count":\s*(\d+)/,
          following: /"following_count":\s*(\d+)/,
          posts: /"media_count":\s*(\d+)/,
          fullName: /"full_name":\s*"([^"]+)"/,
          bio: /"biography":\s*"([^"]*)"/,
          isPrivate: /"is_private":\s*(true|false)/,
          profilePic: /"profile_pic_url":\s*"([^"]+)"/,
          website: /"external_url":\s*"([^"]*)"/,
        },
        // Pattern 3: Simple patterns
        {
          followers: /"followers":\s*(\d+)/,
          following: /"following":\s*(\d+)/,
          posts: /"posts":\s*(\d+)/,
          fullName: /"full_name":\s*"([^"]+)"/,
          bio: /"biography":\s*"([^"]*)"/,
          isPrivate: /"is_private":\s*(true|false)/,
          profilePic: /"profile_pic_url":\s*"([^"]+)"/,
          website: /"external_url":\s*"([^"]*)"/,
        }
      ]

      for (const pattern of patterns) {
        const followersMatch = html.match(pattern.followers)
        const followingMatch = html.match(pattern.following)
        const postsMatch = html.match(pattern.posts)
        const fullNameMatch = html.match(pattern.fullName)
        const bioMatch = html.match(pattern.bio)
        const isPrivateMatch = html.match(pattern.isPrivate)
        const profilePicMatch = html.match(pattern.profilePic)
        const websiteMatch = html.match(pattern.website)

        if (followersMatch || followingMatch || postsMatch) {
          const followersCount = followersMatch ? parseInt(followersMatch[1]) : 0
          const followingCount = followingMatch ? parseInt(followingMatch[1]) : 0
          const postsCount = postsMatch ? parseInt(postsMatch[1]) : 0

          console.log(`Extracted data from HTML: followers=${followersCount}, following=${followingCount}, posts=${postsCount}`)

          return {
            isPublic: !(isPrivateMatch && isPrivateMatch[1] === 'true'),
            profileName: fullNameMatch ? fullNameMatch[1] : username,
            bio: bioMatch ? bioMatch[1] : '',
            profilePicUrl: profilePicMatch ? profilePicMatch[1] : '',
            website: websiteMatch ? websiteMatch[1] : '',
            postsCount: postsCount,
            followersCount: followersCount,
            followingCount: followingCount
          }
        }
      }
    }
    
    // If all else fails, return minimal profile data
    console.log(`Returning minimal profile data for ${username}`)
    return {
      isPublic: true,
      profileName: username,
      bio: '',
      profilePicUrl: '',
      website: '',
      postsCount: 0,
      followersCount: 0,
      followingCount: 0
    }
  } catch (error) {
    console.error('Basic fallback error:', error.message)
    
    // Return minimal data even if everything fails
    return {
      isPublic: true,
      profileName: username,
      bio: '',
      profilePicUrl: '',
      website: '',
      postsCount: 0,
      followersCount: 0,
      followingCount: 0
    }
  }
}

async function fetchRealFollowerData(username, profileData) {
  try {
    // First try the authenticated API approach
    const apiData = await fetchFollowerDataViaAPI(username, profileData)
    if (apiData && apiData.followers.length > 0) {
      return apiData
    }
    
    // If API fails, try web scraping approach
    const scrapedData = await fetchFollowerDataViaWebScraping(username, profileData)
    if (scrapedData && scrapedData.followers.length > 0) {
      return scrapedData
    }
    
    // If both fail, return profile-only data
      return {
      followersCount: profileData.followersCount,
      followingCount: profileData.followingCount,
      notFollowingBackCount: 0,
      percentNotFollowingBack: 0,
      followers: [],
      following: [],
      notFollowingBack: [],
      followBackRate: 0,
      dataSource: 'profile_only'
    }
  } catch (error) {
    console.error('Real follower data error:', error.message)
    
    // Return profile-only data if all methods fail
    return {
      followersCount: profileData.followersCount,
      followingCount: profileData.followingCount,
      notFollowingBackCount: 0,
      percentNotFollowingBack: 0,
      followers: [],
      following: [],
      notFollowingBack: [],
      followBackRate: 0,
      dataSource: 'profile_only'
    }
  }
}

async function fetchFollowerDataViaAPI(username, profileData) {
  try {
    // First try Instagram's official Graph API if we have access token
    if (INSTAGRAM_ACCESS_TOKEN) {
      const graphData = await fetchFollowerDataViaGraphAPI(username, profileData)
      if (graphData && graphData.followers.length > 0) {
        return graphData
      }
    }
    
    // Try Instagram's Basic Display API
    const basicData = await fetchFollowerDataViaBasicAPI(username, profileData)
    if (basicData && basicData.followers.length > 0) {
      return basicData
    }
    
    // Try RapidAPI if configured
    if (RAPIDAPI_KEY) {
      const rapidData = await fetchFollowerDataViaRapidAPI(username, profileData)
      if (rapidData && rapidData.followers.length > 0) {
        return rapidData
      }
    }
    
    // Fallback to session-based API calls
    return await fetchFollowerDataViaSessionAPI(username, profileData)
  } catch (error) {
    console.error('API follower data error:', error.message)
    return null
  }
}

async function fetchFollowerDataViaGraphAPI(username, profileData) {
  try {
    // Use Instagram Graph API to get user data
    const response = await fetch(`https://graph.instagram.com/v12.0/me?fields=id,username,account_type&access_token=${INSTAGRAM_ACCESS_TOKEN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })

    if (!response.ok) {
      throw new Error(`Graph API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.id) {
      // Get followers and following using Graph API
      const [followersResponse, followingResponse] = await Promise.all([
        fetch(`https://graph.instagram.com/v12.0/${data.id}/followers?access_token=${INSTAGRAM_ACCESS_TOKEN}`),
        fetch(`https://graph.instagram.com/v12.0/${data.id}/following?access_token=${INSTAGRAM_ACCESS_TOKEN}`)
      ])

      if (followersResponse.ok && followingResponse.ok) {
        const followersData = await followersResponse.json()
        const followingData = await followingResponse.json()
        
        const followers = followersData.data?.map(user => ({
          username: user.username,
          fullName: user.name || user.username,
          profilePicUrl: user.profile_picture_url || '',
          profileUrl: `https://instagram.com/${user.username}`
        })) || []
        
        const following = followingData.data?.map(user => ({
          username: user.username,
          fullName: user.name || user.username,
          profilePicUrl: user.profile_picture_url || '',
          profileUrl: `https://instagram.com/${user.username}`
        })) || []
        
        return calculateFollowerStats(followers, following, profileData)
      }
    }
    
    return null
  } catch (error) {
    console.error('Graph API error:', error.message)
    return null
  }
}

async function fetchFollowerDataViaBasicAPI(username, profileData) {
  try {
    // Use Instagram Basic Display API
    const response = await fetch(`https://api.instagram.com/v1/users/self?access_token=${INSTAGRAM_ACCESS_TOKEN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })

    if (!response.ok) {
      throw new Error(`Basic API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.data) {
      const userId = data.data.id
      
      // Get followers and following
      const [followersResponse, followingResponse] = await Promise.all([
        fetch(`https://api.instagram.com/v1/users/${userId}/followed-by?access_token=${INSTAGRAM_ACCESS_TOKEN}`),
        fetch(`https://api.instagram.com/v1/users/${userId}/follows?access_token=${INSTAGRAM_ACCESS_TOKEN}`)
      ])

      if (followersResponse.ok && followingResponse.ok) {
        const followersData = await followersResponse.json()
        const followingData = await followingResponse.json()
        
        const followers = followersData.data?.map(user => ({
          username: user.username,
          fullName: user.full_name || user.username,
          profilePicUrl: user.profile_picture || '',
          profileUrl: `https://instagram.com/${user.username}`
        })) || []
        
        const following = followingData.data?.map(user => ({
          username: user.username,
          fullName: user.full_name || user.username,
          profilePicUrl: user.profile_picture || '',
          profileUrl: `https://instagram.com/${user.username}`
        })) || []
        
        return calculateFollowerStats(followers, following, profileData)
      }
    }
    
    return null
  } catch (error) {
    console.error('Basic API error:', error.message)
    return null
  }
}

async function fetchFollowerDataViaRapidAPI(username, profileData) {
  try {
    const response = await fetch(`https://instagram-scraper-2022.p.rapidapi.com/userinfo/${username}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
      },
      timeout: 10000
    })

    if (!response.ok) {
      throw new Error(`RapidAPI request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.user) {
      // RapidAPI might provide follower/following data
      const followers = data.followers?.map(user => ({
        username: user.username,
        fullName: user.full_name || user.username,
        profilePicUrl: user.profile_pic_url || '',
        profileUrl: `https://instagram.com/${user.username}`
      })) || []
      
      const following = data.following?.map(user => ({
        username: user.username,
        fullName: user.full_name || user.username,
        profilePicUrl: user.profile_pic_url || '',
        profileUrl: `https://instagram.com/${user.username}`
      })) || []
      
      return calculateFollowerStats(followers, following, profileData)
    }
    
    return null
    } catch (error) {
    console.error('RapidAPI error:', error.message)
    return null
  }
}

async function fetchFollowerDataViaSessionAPI(username, profileData) {
  try {
    console.log(`Attempting mobile API for followers/following data for ${username}`)
    
    // Get user ID if not provided
    let userId = profileData.userId
    if (!userId) {
      // Get user ID using mobile API
      const userResponse = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      method: 'GET',
      headers: {
          'User-Agent': 'Instagram 155.0.0.37.107',
          'X-IG-App-ID': '936619743392459',
          'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
      }
    })

      if (userResponse.ok) {
    const userData = await userResponse.json()
        userId = userData.data.user.id
      }
    }

    if (!userId) {
      throw new Error('Could not get user ID')
    }

    // Try to fetch followers and following using mobile API
    const [followers, following] = await Promise.all([
      fetchAllFollowersMobile(userId),
      fetchAllFollowingMobile(userId)
    ])

    return calculateFollowerStats(followers, following, profileData)
  } catch (error) {
    console.error('Mobile API error:', error.message)
    return null
  }
}

async function fetchFollowerDataViaWebScraping(username, profileData) {
  try {
    // Use web scraping to get follower data from Instagram's public page
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`Instagram web scraping failed: ${response.status}`)
    }

    const html = await response.text()
    
    // Try multiple methods to extract data from HTML
    const extractedData = await extractDataFromHTML(html, username, profileData)
    if (extractedData) {
      return extractedData
    }
    
    // If HTML extraction fails, try alternative methods
    return await fetchFollowerDataViaAlternativeMethods(username, profileData)
  } catch (error) {
    console.error('Web scraping error:', error.message)
    return null
  }
}

async function extractDataFromHTML(html, username, profileData) {
  try {
    // Method 1: Try to extract from window._sharedData
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/)
    if (sharedDataMatch) {
      try {
        const userData = JSON.parse(sharedDataMatch[1])
        const user = userData.entry_data.ProfilePage[0].graphql.user
        
        const followers = user.edge_followed_by.edges?.map(edge => ({
          username: edge.node.username,
          fullName: edge.node.full_name,
          profilePicUrl: edge.node.profile_pic_url,
          profileUrl: `https://instagram.com/${edge.node.username}`
        })) || []
        
        const following = user.edge_follow.edges?.map(edge => ({
          username: edge.node.username,
          fullName: edge.node.full_name,
          profilePicUrl: edge.node.profile_pic_url,
          profileUrl: `https://instagram.com/${edge.node.username}`
        })) || []
        
        if (followers.length > 0 || following.length > 0) {
          return calculateFollowerStats(followers, following, profileData)
        }
      } catch (parseError) {
        console.error('Failed to parse _sharedData:', parseError)
      }
    }
    
    // Method 2: Try to extract from additional_data
    const additionalDataMatch = html.match(/window\.__additionalDataLoaded\s*\(\s*'[^']+'\s*,\s*({.+?})\s*\)/)
    if (additionalDataMatch) {
      try {
        const additionalData = JSON.parse(additionalDataMatch[1])
        if (additionalData.graphql && additionalData.graphql.user) {
          const user = additionalData.graphql.user
          
          const followers = user.edge_followed_by.edges?.map(edge => ({
            username: edge.node.username,
            fullName: edge.node.full_name,
            profilePicUrl: edge.node.profile_pic_url,
            profileUrl: `https://instagram.com/${edge.node.username}`
          })) || []
          
          const following = user.edge_follow.edges?.map(edge => ({
            username: edge.node.username,
            fullName: edge.node.full_name,
            profilePicUrl: edge.node.profile_pic_url,
            profileUrl: `https://instagram.com/${edge.node.username}`
          })) || []
          
          if (followers.length > 0 || following.length > 0) {
            return calculateFollowerStats(followers, following, profileData)
          }
        }
      } catch (parseError) {
        console.error('Failed to parse additional_data:', parseError)
      }
    }
    
    // Method 3: Try to extract from script tags with user data
    const scriptMatches = html.match(/<script[^>]*type="application\/json"[^>]*>(.*?)<\/script>/g)
    if (scriptMatches) {
      for (const scriptMatch of scriptMatches) {
        try {
          const jsonMatch = scriptMatch.match(/<script[^>]*type="application\/json"[^>]*>(.*?)<\/script>/)
          if (jsonMatch) {
            const scriptData = JSON.parse(jsonMatch[1])
            if (scriptData.entry_data && scriptData.entry_data.ProfilePage) {
              const user = scriptData.entry_data.ProfilePage[0].graphql.user
              
              const followers = user.edge_followed_by.edges?.map(edge => ({
                username: edge.node.username,
                fullName: edge.node.full_name,
                profilePicUrl: edge.node.profile_pic_url,
                profileUrl: `https://instagram.com/${edge.node.username}`
              })) || []
              
              const following = user.edge_follow.edges?.map(edge => ({
                username: edge.node.username,
                fullName: edge.node.full_name,
                profilePicUrl: edge.node.profile_pic_url,
                profileUrl: `https://instagram.com/${edge.node.username}`
              })) || []
              
              if (followers.length > 0 || following.length > 0) {
                return calculateFollowerStats(followers, following, profileData)
              }
            }
          }
        } catch (parseError) {
          console.error('Failed to parse script data:', parseError)
        }
      }
    }
    
    // Method 4: Try to extract from modern Instagram data structure
    const modernDataMatch = html.match(/"user":\s*({[^}]+"edge_followed_by":[^}]+})/)
    if (modernDataMatch) {
      try {
        const userData = JSON.parse(modernDataMatch[1])
        
        const followers = userData.edge_followed_by?.edges?.map(edge => ({
          username: edge.node.username,
          fullName: edge.node.full_name,
          profilePicUrl: edge.node.profile_pic_url,
          profileUrl: `https://instagram.com/${edge.node.username}`
        })) || []
        
        const following = userData.edge_follow?.edges?.map(edge => ({
          username: edge.node.username,
          fullName: edge.node.full_name,
          profilePicUrl: edge.node.profile_pic_url,
          profileUrl: `https://instagram.com/${edge.node.username}`
        })) || []
        
        if (followers.length > 0 || following.length > 0) {
          return calculateFollowerStats(followers, following, profileData)
        }
      } catch (parseError) {
        console.error('Failed to parse modern data structure:', parseError)
      }
    }
    
    return null
  } catch (error) {
    console.error('HTML extraction error:', error.message)
    return null
  }
}

function calculateFollowerStats(followers, following, profileData) {
  // Calculate non-followers
        const followersSet = new Set(followers.map(u => u.username))
        const notFollowingBack = following.filter(u => !followersSet.has(u.username))
        
        const notFollowingBackCount = notFollowingBack.length
        const percentNotFollowingBack = following.length > 0 ? Math.round((notFollowingBackCount / following.length) * 100) : 0
        const followBackRate = following.length > 0 ? Math.round(((following.length - notFollowingBackCount) / following.length) * 100) : 0

        return {
    followersCount: followers.length || profileData.followersCount,
    followingCount: following.length || profileData.followingCount,
          notFollowingBackCount,
          percentNotFollowingBack,
          followers,
          following,
          notFollowingBack,
          followBackRate,
          dataSource: 'real'
  }
}

async function fetchFollowerDataViaAlternativeMethods(username, profileData) {
  try {
    // Try Instagram's GraphQL API as an alternative
    const response = await fetch('https://www.instagram.com/graphql/query/', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      body: new URLSearchParams({
        query_hash: 'c76146de99bb602f4ace91d5e1e2a6b8',
        variables: JSON.stringify({
          id: username,
          first: 50,
          after: null
        })
      }),
      timeout: 15000
    })

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.data && data.data.user) {
      const user = data.data.user
      const followers = user.edge_followed_by.edges?.map(edge => ({
        username: edge.node.username,
        fullName: edge.node.full_name,
        profilePicUrl: edge.node.profile_pic_url,
        profileUrl: `https://instagram.com/${edge.node.username}`
      })) || []
      
      const following = user.edge_follow.edges?.map(edge => ({
        username: edge.node.username,
        fullName: edge.node.full_name,
        profilePicUrl: edge.node.profile_pic_url,
        profileUrl: `https://instagram.com/${edge.node.username}`
      })) || []
      
      // Calculate non-followers
      const followersSet = new Set(followers.map(u => u.username))
      const notFollowingBack = following.filter(u => !followersSet.has(u.username))
      
      const notFollowingBackCount = notFollowingBack.length
      const percentNotFollowingBack = following.length > 0 ? Math.round((notFollowingBackCount / following.length) * 100) : 0
      const followBackRate = following.length > 0 ? Math.round(((following.length - notFollowingBackCount) / following.length) * 100) : 0

      return {
        followersCount: followers.length || profileData.followersCount,
        followingCount: following.length || profileData.followingCount,
        notFollowingBackCount,
        percentNotFollowingBack,
        followers,
        following,
        notFollowingBack,
        followBackRate,
        dataSource: 'real'
      }
    }
    
    return null
  } catch (error) {
    console.error('Alternative methods error:', error.message)
    return null
  }
}

async function fetchAllFollowers(userId, cookies) {
  const followers = []
  let hasNextPage = true
  let endCursor = null

  while (hasNextPage && followers.length < 1000) { // Limit to 1000 followers
    try {
      const response = await fetch(`https://www.instagram.com/api/v1/friendships/${userId}/followers/?count=50${endCursor ? `&max_id=${endCursor}` : ''}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'X-IG-App-ID': '936619743392459',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Cookie': cookies
          },
          timeout: 10000
        })

      if (!response.ok) {
        throw new Error(`Followers API request failed: ${response.status}`)
      }

          const data = await response.json()
      
      if (data && data.users) {
        const newFollowers = data.users.map(user => ({
                username: user.username,
                fullName: user.full_name || user.username,
          profilePicUrl: user.profile_pic_url || '',
                profileUrl: `https://instagram.com/${user.username}`
        }))
        
        followers.push(...newFollowers)
        
        // Check if there are more pages
        hasNextPage = data.next_max_id ? true : false
        endCursor = data.next_max_id
      } else {
        hasNextPage = false
      }
    } catch (error) {
      console.error('Followers fetch error:', error.message)
      hasNextPage = false
    }
  }

  return followers
}

async function fetchAllFollowing(userId, cookies) {
  const following = []
  let hasNextPage = true
  let endCursor = null

  while (hasNextPage && following.length < 1000) { // Limit to 1000 following
    try {
      const response = await fetch(`https://www.instagram.com/api/v1/friendships/${userId}/following/?count=50${endCursor ? `&max_id=${endCursor}` : ''}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'X-IG-App-ID': '936619743392459',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Cookie': cookies
        },
        timeout: 10000
      })

      if (!response.ok) {
        throw new Error(`Following API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data && data.users) {
        const newFollowing = data.users.map(user => ({
          username: user.username,
          fullName: user.full_name || user.username,
          profilePicUrl: user.profile_pic_url || '',
          profileUrl: `https://instagram.com/${user.username}`
        }))
        
        following.push(...newFollowing)
        
        // Check if there are more pages
        hasNextPage = data.next_max_id ? true : false
        endCursor = data.next_max_id
      } else {
        hasNextPage = false
      }
    } catch (error) {
      console.error('Following fetch error:', error.message)
      hasNextPage = false
    }
  }

  return following
}

async function fetchAllFollowersMobile(userId) {
  const followers = []
  let hasNextPage = true
  let maxId = null
  let attempts = 0
  const maxAttempts = 50 // Limit to 50 pages

  while (hasNextPage && followers.length < 10000 && attempts < maxAttempts) {
    try {
      attempts++
      const url = `https://i.instagram.com/api/v1/friendships/${userId}/followers/?count=200${maxId ? `&max_id=${maxId}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Instagram 155.0.0.37.107',
          'X-IG-App-ID': '936619743392459',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'X-Requested-With': 'XMLHttpRequest',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        },
        timeout: 10000
      })

      // Check content type
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Received HTML instead of JSON for followers')
        break
      }

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        throw new Error(`Followers mobile API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data && data.users) {
        const newFollowers = data.users.map(user => ({
          username: user.username,
          fullName: user.full_name || user.username,
          profilePicUrl: user.profile_pic_url || '',
          profileUrl: `https://instagram.com/${user.username}`
        }))
        
        followers.push(...newFollowers)
        console.log(`Fetched ${newFollowers.length} followers (total: ${followers.length})`)
        
        // Check if there are more pages
        hasNextPage = data.next_max_id ? true : false
        maxId = data.next_max_id
      } else {
        hasNextPage = false
      }
    } catch (error) {
      console.error('Followers mobile fetch error:', error.message)
      hasNextPage = false
    }
  }

  console.log(`Total followers fetched: ${followers.length}`)
  return followers
}

async function fetchAllFollowingMobile(userId) {
  const following = []
  let hasNextPage = true
  let maxId = null
  let attempts = 0
  const maxAttempts = 50 // Limit to 50 pages

  while (hasNextPage && following.length < 10000 && attempts < maxAttempts) {
    try {
      attempts++
      const url = `https://i.instagram.com/api/v1/friendships/${userId}/following/?count=200${maxId ? `&max_id=${maxId}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Instagram 155.0.0.37.107',
          'X-IG-App-ID': '936619743392459',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'X-Requested-With': 'XMLHttpRequest',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        },
        timeout: 10000
      })

      // Check content type
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Received HTML instead of JSON for following')
        break
      }

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        throw new Error(`Following mobile API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data && data.users) {
        const newFollowing = data.users.map(user => ({
          username: user.username,
          fullName: user.full_name || user.username,
          profilePicUrl: user.profile_pic_url || '',
          profileUrl: `https://instagram.com/${user.username}`
        }))
        
        following.push(...newFollowing)
        console.log(`Fetched ${newFollowing.length} following (total: ${following.length})`)
        
        // Check if there are more pages
        hasNextPage = data.next_max_id ? true : false
        maxId = data.next_max_id
      } else {
        hasNextPage = false
      }
    } catch (error) {
      console.error('Following mobile fetch error:', error.message)
      hasNextPage = false
    }
  }

  console.log(`Total following fetched: ${following.length}`)
  return following
}

export async function POST(request) {
  try {
    const { username } = await request.json()
    const result = await handler({ username })
    
    return NextResponse.json(result, { 
      status: result.error ? 400 : 200 
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: "Network error. Please try again." }, 
      { status: 500 }
    )
  }
} 