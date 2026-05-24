const https = require('https');

function makeRequest(url, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = data ? JSON.stringify(data) : '';
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (data) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: headers
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            rawData: body
          });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (data) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTest() {
  // Let's use a real login token if we have one, or register a temp user and create some mock history to see the response
  const email = `test_farmer_${Date.now()}@example.com`;
  const username = `farmer_${Date.now()}`;
  const password = "Password123!";
  
  try {
    console.log("1. Registering farmer...");
    await makeRequest('https://torbati.onrender.com/api/sign-up', 'POST', { username, email, password });
    
    console.log("2. Logging in...");
    const loginRes = await makeRequest('https://torbati.onrender.com/api/login', 'POST', { email, password });
    const token = loginRes.data?.token || loginRes.data?.key;
    
    console.log("3. Fetching api/history for the user...");
    const historyRes = await makeRequest('https://torbati.onrender.com/api/history', 'GET', null, token);
    console.log("api/history status:", historyRes.status);
    console.log("api/history data:", JSON.stringify(historyRes.data, null, 2));

    console.log("\n4. Creating a recommendation session in Algiers...");
    const recoRes = await makeRequest('https://torbati.onrender.com/api/recommendation', 'POST', {
      lat: 36.7,
      lon: 3.2
    }, token);
    const sessionId = recoRes.data?.recommendations?.id;
    console.log("Created Session ID:", sessionId);

    console.log("\n5. Fetching api/history again after creating a session...");
    const historyRes2 = await makeRequest('https://torbati.onrender.com/api/history', 'GET', null, token);
    console.log("api/history status:", historyRes2.status);
    console.log("api/history data:", JSON.stringify(historyRes2.data, null, 2));

  } catch (err) {
    console.error("Test failed with error:", err.message);
  }
}

runTest();
