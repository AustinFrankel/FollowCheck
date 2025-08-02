// Client-side Instagram data fetcher for static export
export async function fetchInstagramProfile(username) {
  try {
    // Try multiple methods to get profile data
    const methods = [
      () => fetchInstagramPublicAPI(username),
      () => fetchInstagramDataFromBasicFallback(username),
      () => fetchInstagramDataFromDirectScraping(username)
    ]

    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`Trying method ${i + 1} for username: ${username}`)
        const data = await methods[i]()
        if (data && data.profileName && data.followersCount >= 0) {
          console.log(`Successfully fetched data using method ${i + 1}`)
          return data
        }
      } catch (error) {
        console.error(`Method ${i + 1} failed:`, error.message)
        continue
      }
    }

    return null
  } catch (error) {
    console.error('Profile fetch error:', error.message)
    return null
  }
}

async function fetchInstagramPublicAPI(username) {
  try {
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
      }
    })

    if (!response.ok) {
      throw new Error(`Instagram API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data && data.data && data.data.user) {
      const user = data.data.user
      return {
        username: username,
        isPublic: !user.is_private,
        profileName: user.full_name || username,
        bio: user.biography || '',
        profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || '',
        website: user.external_url || '',
        postsCount: user.edge_owner_to_timeline_media?.count || 0,
        followersCount: user.edge_followed_by?.count || 0,
        followingCount: user.edge_follow?.count || 0,
        notFollowingBackCount: 0,
        percentNotFollowingBack: 0,
        followers: [],
        following: [],
        notFollowingBack: [],
        dataSource: 'profile_only',
        analysis: {
          totalAnalyzed: 0,
          mutualFollowers: user.edge_followed_by?.count || 0,
          nonFollowers: 0,
          followBackRate: 0
        },
        externalLinks: {
          instagramProfile: `https://instagram.com/${username}`,
          socialblade: `https://socialblade.com/instagram/user/${username}/monthly`,
          hypeauditor: `https://hypeauditor.com/instagram/${username}`,
          rapidapi: `https://rapidapi.com/3b-data-3b-data-default/api/instagram-bulk-user-data/`,
          message: "For detailed follower analysis, visit these external services:"
        }
      }
    }
    
    throw new Error('No user data found in Instagram API response')
  } catch (error) {
    console.error('Instagram API error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromBasicFallback(username) {
  try {
    // Use a CORS proxy to avoid CORS issues
    const corsProxy = 'https://cors-anywhere.herokuapp.com/'
    const response = await fetch(`${corsProxy}https://www.instagram.com/${username}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    })

    if (!response.ok) {
      throw new Error(`Instagram scraping failed: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract data from HTML using regex patterns
    const patterns = [
      {
        followers: /"edge_followed_by":\s*{\s*"count":\s*(\d+)/,
        following: /"edge_follow":\s*{\s*"count":\s*(\d+)/,
        posts: /"edge_owner_to_timeline_media":\s*{\s*"count":\s*(\d+)/,
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

        return {
          username: username,
          isPublic: !(isPrivateMatch && isPrivateMatch[1] === 'true'),
          profileName: fullNameMatch ? fullNameMatch[1] : username,
          bio: bioMatch ? bioMatch[1] : '',
          profilePicUrl: profilePicMatch ? profilePicMatch[1] : '',
          website: websiteMatch ? websiteMatch[1] : '',
          postsCount: postsCount,
          followersCount: followersCount,
          followingCount: followingCount,
          notFollowingBackCount: 0,
          percentNotFollowingBack: 0,
          followers: [],
          following: [],
          notFollowingBack: [],
          dataSource: 'profile_only',
          analysis: {
            totalAnalyzed: 0,
            mutualFollowers: followersCount,
            nonFollowers: 0,
            followBackRate: 0
          },
          externalLinks: {
            instagramProfile: `https://instagram.com/${username}`,
            socialblade: `https://socialblade.com/instagram/user/${username}/monthly`,
            hypeauditor: `https://hypeauditor.com/instagram/${username}`,
            rapidapi: `https://rapidapi.com/3b-data-3b-data-default/api/instagram-bulk-user-data/`,
            message: "For detailed follower analysis, visit these external services:"
          }
        }
      }
    }
    
    throw new Error('Could not extract data from Instagram page')
  } catch (error) {
    console.error('Basic fallback error:', error.message)
    throw error
  }
}

async function fetchInstagramDataFromDirectScraping(username) {
  try {
    // Use a different CORS proxy
    const corsProxy = 'https://api.allorigins.win/raw?url='
    const response = await fetch(`${corsProxy}${encodeURIComponent(`https://www.instagram.com/${username}/`)}`, {
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

    if (!response.ok) {
      throw new Error(`Direct scraping failed: ${response.status}`)
    }

    const html = await response.text()
    
    // Try to extract from window._sharedData
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/)
    if (sharedDataMatch) {
      try {
        const userData = JSON.parse(sharedDataMatch[1])
        const user = userData.entry_data.ProfilePage[0].graphql.user
        
        return {
          username: username,
          isPublic: !user.is_private,
          profileName: user.full_name || username,
          bio: user.biography || '',
          profilePicUrl: user.profile_pic_url || '',
          website: user.external_url || '',
          postsCount: user.edge_owner_to_timeline_media?.count || 0,
          followersCount: user.edge_followed_by?.count || 0,
          followingCount: user.edge_follow?.count || 0,
          notFollowingBackCount: 0,
          percentNotFollowingBack: 0,
          followers: [],
          following: [],
          notFollowingBack: [],
          dataSource: 'profile_only',
          analysis: {
            totalAnalyzed: 0,
            mutualFollowers: user.edge_followed_by?.count || 0,
            nonFollowers: 0,
            followBackRate: 0
          },
          externalLinks: {
            instagramProfile: `https://instagram.com/${username}`,
            socialblade: `https://socialblade.com/instagram/user/${username}/monthly`,
            hypeauditor: `https://hypeauditor.com/instagram/${username}`,
            rapidapi: `https://rapidapi.com/3b-data-3b-data-default/api/instagram-bulk-user-data/`,
            message: "For detailed follower analysis, visit these external services:"
          }
        }
      } catch (parseError) {
        console.error('Failed to parse _sharedData:', parseError)
      }
    }
    
    throw new Error('Could not extract data from Instagram page')
  } catch (error) {
    console.error('Direct scraping error:', error.message)
    throw error
  }
} 