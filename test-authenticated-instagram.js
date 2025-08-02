const fetch = require('node-fetch');

// Test the authenticated Instagram API
async function testAuthenticatedInstagram() {
  try {
    console.log('Testing authenticated Instagram API...');
    
    const response = await fetch('http://localhost:3000/api/analyze-instagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'instagram' // Test with a public account
      })
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      console.log('✅ Success! Data source:', data.dataSource);
      console.log('Followers count:', data.followersCount);
      console.log('Following count:', data.followingCount);
      console.log('Not following back:', data.notFollowingBackCount);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testAuthenticatedInstagram(); 