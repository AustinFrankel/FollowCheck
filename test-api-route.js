const fetch = require('node-fetch');

async function testAPIRoute() {
  try {
    console.log('Testing API route...');
    
    // Test 1: Check if server is running
    const healthResponse = await fetch('http://localhost:3000/');
    console.log('Health check status:', healthResponse.status);
    
    // Test 2: Test the API route
    const apiResponse = await fetch('http://localhost:3000/api/analyze-instagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: 'instagram'
      })
    });
    
    console.log('API response status:', apiResponse.status);
    console.log('API response headers:', Object.fromEntries(apiResponse.headers.entries()));
    
    const responseText = await apiResponse.text();
    console.log('Response length:', responseText.length);
    console.log('Response preview:', responseText.substring(0, 200));
    
    if (apiResponse.ok && responseText.startsWith('{')) {
      const data = JSON.parse(responseText);
      console.log('✅ API working! Data source:', data.dataSource);
    } else {
      console.log('❌ API not working properly');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPIRoute(); 