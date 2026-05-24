const https = require('https');

function makeRequest(url, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = data ? JSON.stringify(data) : '';
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (data && method === 'POST') {
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
    if (data && method === 'POST') {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  const email = `farmer_inspect_${Date.now()}@example.com`;
  const username = `farmer_inspect_${Date.now()}`;
  const password = "Password123!";
  
  try {
    console.log("1. Registering & logging in...");
    await makeRequest('https://torbati.onrender.com/api/sign-up', 'POST', { username, email, password });
    const loginRes = await makeRequest('https://torbati.onrender.com/api/login', 'POST', { email, password });
    const token = loginRes.data?.token || loginRes.data?.key;
    
    console.log("2. Creating a recommendation session...");
    const recoRes = await makeRequest('https://torbati.onrender.com/api/recommendation', 'POST', {
      lat: 36.7,
      lon: 3.2
    }, token);
    const sessionId = recoRes.data?.recommendations?.id;

    console.log("3. Fetching recommended crops...");
    const cropsRes = await makeRequest('https://torbati.onrender.com/api/crop-recommendation', 'POST', {
      session_id: sessionId
    }, token);
    const list = cropsRes.data?.["Crop List"] || cropsRes.data?.crop_list || cropsRes.data;
    const cropRecoId = list[0].id;

    console.log("4. Creating Field Analysis for the crop...");
    const polygon = [
      [36.701, 3.201],
      [36.699, 3.201],
      [36.699, 3.199],
      [36.701, 3.199]
    ];
    const faRes = await makeRequest('https://torbati.onrender.com/api/field/analysis/', 'POST', {
      crop_recommendation: cropRecoId,
      polygon_coords: polygon,
      surface_area_m2: 1200
    }, token);
    const faId = faRes.data?.field_analysis_id || faRes.data?.id;
    console.log("Created Field Analysis ID:", faId);

    console.log("\n5. Testing GET /api/field/analysis/ ...");
    const getRes = await makeRequest('https://torbati.onrender.com/api/field/analysis/', 'GET', null, token);
    console.log("GET /api/field/analysis/ status:", getRes.status);
    console.log("GET /api/field/analysis/ data:", JSON.stringify(getRes.data, null, 2));

    console.log("\n6. Testing GET /api/field/analysis/?crop_recommendation=" + cropRecoId + " ...");
    const getRes2 = await makeRequest('https://torbati.onrender.com/api/field/analysis/?crop_recommendation=' + cropRecoId, 'GET', null, token);
    console.log("GET with crop_recommendation query status:", getRes2.status);
    console.log("GET with crop_recommendation query data:", JSON.stringify(getRes2.data, null, 2));

    console.log("\n7. Testing GET /api/field/analysis/history/ ...");
    const getRes3 = await makeRequest('https://torbati.onrender.com/api/field/analysis/history/', 'GET', null, token);
    console.log("GET history status:", getRes3.status);
    console.log("GET history data:", JSON.stringify(getRes3.data, null, 2));

  } catch (err) {
    console.error("Error:", err);
  }
}

run();
