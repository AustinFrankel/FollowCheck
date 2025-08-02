#!/usr/bin/env node

/**
 * Test script for Instagram data sources
 * Run with: node test-data-sources.js
 */

const fetch = require('node-fetch');

// Test usernames
const TEST_USERNAMES = ['instagram', 'cristiano', 'taylorswift'];

// Environment variables
require('dotenv').config({ path: '.env.local' });

const API_KEYS = {
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  SCRAPINGBEE_KEY: process.env.SCRAPINGBEE_KEY,
  BRIGHTDATA_KEY: process.env.BRIGHTDATA_KEY,
  ZYTE_KEY: process.env.ZYTE_KEY,
  APIFY_KEY: process.env.APIFY_KEY,
  PROXYCURL_KEY: process.env.PROXYCURL_KEY
};

async function testInstagramPublicAPI(username) {
  console.log(`\n🔍 Testing Instagram Public API for @${username}...`);
  
  try {
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
        'Pragma': 'no-cache'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.data && data.data.user) {
      const user = data.data.user;
      console.log(`✅ Success! Found profile: ${user.full_name}`);
      console.log(`   Followers: ${user.edge_followed_by?.count || 0}`);
      console.log(`   Following: ${user.edge_follow?.count || 0}`);
      console.log(`   Posts: ${user.edge_owner_to_timeline_media?.count || 0}`);
      return true;
    }
    
    throw new Error('No user data found');
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function testSocialblade(username) {
  console.log(`\n📊 Testing Socialblade for @${username}...`);
  
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
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract follower count from Socialblade
    const followerMatch = html.match(/Followers<\/div><div[^>]*>([\d,]+)/);
    const followingMatch = html.match(/Following<\/div><div[^>]*>([\d,]+)/);
    const postsMatch = html.match(/Posts<\/div><div[^>]*>([\d,]+)/);
    
    if (followerMatch) {
      const followersCount = parseInt(followerMatch[1].replace(/,/g, ''));
      const followingCount = followingMatch ? parseInt(followingMatch[1].replace(/,/g, '')) : 0;
      const postsCount = postsMatch ? parseInt(postsMatch[1].replace(/,/g, '')) : 0;
      
      console.log(`✅ Success! Found data on Socialblade`);
      console.log(`   Followers: ${followersCount.toLocaleString()}`);
      console.log(`   Following: ${followingCount.toLocaleString()}`);
      console.log(`   Posts: ${postsCount.toLocaleString()}`);
      return true;
    }
    
    throw new Error('Could not extract data from Socialblade');
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function testHypeAuditor(username) {
  console.log(`\n📈 Testing HypeAuditor for @${username}...`);
  
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
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract data from HypeAuditor
    const followerMatch = html.match(/"followers":\s*(\d+)/);
    const followingMatch = html.match(/"following":\s*(\d+)/);
    const postsMatch = html.match(/"posts":\s*(\d+)/);
    
    if (followerMatch) {
      const followersCount = parseInt(followerMatch[1]);
      const followingCount = followingMatch ? parseInt(followingMatch[1]) : 0;
      const postsCount = postsMatch ? parseInt(postsMatch[1]) : 0;
      
      console.log(`✅ Success! Found data on HypeAuditor`);
      console.log(`   Followers: ${followersCount.toLocaleString()}`);
      console.log(`   Following: ${followingCount.toLocaleString()}`);
      console.log(`   Posts: ${postsCount.toLocaleString()}`);
      return true;
    }
    
    throw new Error('Could not extract data from HypeAuditor');
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function testScrapingBee(username) {
  if (!API_KEYS.SCRAPINGBEE_KEY) {
    console.log(`\n🐝 Skipping ScrapingBee test (no API key)`);
    return false;
  }

  console.log(`\n🐝 Testing ScrapingBee for @${username}...`);
  
  try {
    const response = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${API_KEYS.SCRAPINGBEE_KEY}&url=https://www.instagram.com/${username}/&render_js=false&premium_proxy=true&country_code=us`, {
      method: 'GET',
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract data from the HTML using regex patterns
    const followersMatch = html.match(/"edge_followed_by":{"count":(\d+)}/)
    const followingMatch = html.match(/"edge_follow":{"count":(\d+)}/)
    const postsMatch = html.match(/"edge_owner_to_timeline_media":{"count":(\d+)}/)
    const fullNameMatch = html.match(/"full_name":"([^"]+)"/)

    if (followersMatch || followingMatch || postsMatch) {
      console.log(`✅ Success! Found data via ScrapingBee`);
      if (fullNameMatch) console.log(`   Name: ${fullNameMatch[1]}`);
      if (followersMatch) console.log(`   Followers: ${parseInt(followersMatch[1]).toLocaleString()}`);
      if (followingMatch) console.log(`   Following: ${parseInt(followingMatch[1]).toLocaleString()}`);
      if (postsMatch) console.log(`   Posts: ${parseInt(postsMatch[1]).toLocaleString()}`);
      return true;
    }
    
    throw new Error('Could not extract data from Instagram page via ScrapingBee');
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function testRapidAPI(username) {
  if (!API_KEYS.RAPIDAPI_KEY) {
    console.log(`\n⚡ Skipping RapidAPI test (no API key)`);
    return false;
  }

  console.log(`\n⚡ Testing RapidAPI for @${username}...`);
  
  try {
    const response = await fetch(`https://instagram-scraper-2022.p.rapidapi.com/userinfo/${username}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEYS.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.user) {
      console.log(`✅ Success! Found data via RapidAPI`);
      console.log(`   Name: ${data.user.full_name || username}`);
      console.log(`   Followers: ${(data.user.follower_count || 0).toLocaleString()}`);
      console.log(`   Following: ${(data.user.following_count || 0).toLocaleString()}`);
      console.log(`   Posts: ${(data.user.media_count || 0).toLocaleString()}`);
      return true;
    }
    
    throw new Error('No user data found in RapidAPI response');
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Instagram Data Sources\n');
  console.log('Available API Keys:');
  Object.entries(API_KEYS).forEach(([key, value]) => {
    console.log(`   ${key}: ${value ? '✅ Configured' : '❌ Not configured'}`);
  });

  for (const username of TEST_USERNAMES) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing username: @${username}`);
    console.log(`${'='.repeat(50)}`);

    const results = await Promise.all([
      testInstagramPublicAPI(username),
      testSocialblade(username),
      testHypeAuditor(username),
      testScrapingBee(username),
      testRapidAPI(username)
    ]);

    const successCount = results.filter(Boolean).length;
    console.log(`\n📊 Results for @${username}: ${successCount}/${results.length} sources working`);
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log('🎉 Testing complete!');
  console.log('Check the results above to see which data sources are working.');
  console.log('For best results, configure API keys for paid services.');
}

// Run the tests
runTests().catch(console.error); 