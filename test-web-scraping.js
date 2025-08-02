const fetch = require('node-fetch');

async function testWebScraping() {
  const username = 'instagram';
  
  console.log('Testing Instagram web scraping...');
  
  try {
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
      timeout: 10000
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const html = await response.text();
      
      // Extract data from the HTML using regex patterns
      const followersMatch = html.match(/"edge_followed_by":{"count":(\d+)}/)
      const followingMatch = html.match(/"edge_follow":{"count":(\d+)}/)
      const postsMatch = html.match(/"edge_owner_to_timeline_media":{"count":(\d+)}/)
      const fullNameMatch = html.match(/"full_name":"([^"]+)"/)
      const bioMatch = html.match(/"biography":"([^"]*)"/)
      const isPrivateMatch = html.match(/"is_private":(\w+)/)
      const profilePicMatch = html.match(/"profile_pic_url":"([^"]+)"/)
      const externalUrlMatch = html.match(/"external_url":"([^"]*)"/)

      console.log('Followers match:', followersMatch);
      console.log('Following match:', followingMatch);
      console.log('Posts match:', postsMatch);
      console.log('Full name match:', fullNameMatch);
      console.log('Bio match:', bioMatch);
      console.log('Is private match:', isPrivateMatch);
      console.log('Profile pic match:', profilePicMatch);
      console.log('External URL match:', externalUrlMatch);

      if (followersMatch || followingMatch || postsMatch) {
        console.log('✅ Real data found!');
        console.log('Followers:', followersMatch ? parseInt(followersMatch[1]) : 'Not found');
        console.log('Following:', followingMatch ? parseInt(followingMatch[1]) : 'Not found');
        console.log('Posts:', postsMatch ? parseInt(postsMatch[1]) : 'Not found');
        console.log('Name:', fullNameMatch ? fullNameMatch[1] : 'Not found');
        console.log('Bio:', bioMatch ? bioMatch[1] : 'Not found');
      } else {
        console.log('❌ No real data found in HTML');
        
        // Look for any data patterns in the HTML
        const dataPatterns = [
          /"followers":\s*(\d+)/g,
          /"following":\s*(\d+)/g,
          /"posts":\s*(\d+)/g,
          /"count":\s*(\d+)/g,
          /"full_name":\s*"([^"]+)"/g,
          /"biography":\s*"([^"]*)"/g
        ];
        
        console.log('\nSearching for other data patterns...');
        dataPatterns.forEach((pattern, index) => {
          const matches = html.match(pattern);
          if (matches) {
            console.log(`Pattern ${index + 1} found:`, matches);
          }
        });
      }
    } else {
      console.error('❌ Web scraping failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWebScraping(); 