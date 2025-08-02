// Test script to verify Instagram API is working with real data
const fetch = require('node-fetch');

async function testInstagramAPI() {
  console.log('Testing Instagram API with real data...\n');
  
  const testUsernames = [
    'instagram', // Official Instagram account
    'cristiano', // Cristiano Ronaldo
    'selenagomez', // Selena Gomez
    'taylorswift', // Taylor Swift
    'kimkardashian' // Kim Kardashian
  ];
  
  for (const username of testUsernames) {
    try {
      console.log(`Testing username: @${username}`);
      
      const response = await fetch('http://localhost:3000/api/analyze-instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.log(`❌ Error: ${data.error}`);
      } else {
        console.log(`✅ Success!`);
        console.log(`   Profile: ${data.profileName}`);
        console.log(`   Followers: ${data.followersCount?.toLocaleString()}`);
        console.log(`   Following: ${data.followingCount?.toLocaleString()}`);
        console.log(`   Posts: ${data.postsCount?.toLocaleString()}`);
        console.log(`   Data Source: ${data.dataSource}`);
        console.log(`   Not Following Back: ${data.notFollowingBackCount || 0}`);
      }
      
      console.log(''); // Empty line for readability
      
      // Wait a bit between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`❌ Network error for @${username}: ${error.message}`);
      console.log('');
    }
  }
  
  console.log('Test completed!');
}

// Run the test
testInstagramAPI().catch(console.error); 