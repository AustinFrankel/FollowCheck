const fetch = require('node-fetch');

async function testInstagramDirect() {
  const username = 'instagram';
  
  console.log('Testing Instagram API directly...');
  
  try {
    // Test Instagram's public API
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

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data && data.data && data.data.user) {
        const user = data.data.user;
        console.log('✅ Real Instagram data found!');
        console.log('Followers:', user.edge_followed_by?.count);
        console.log('Following:', user.edge_follow?.count);
        console.log('Posts:', user.edge_owner_to_timeline_media?.count);
        console.log('Name:', user.full_name);
        console.log('Bio:', user.biography);
      }
    } else {
      console.error('❌ API request failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testInstagramDirect(); 