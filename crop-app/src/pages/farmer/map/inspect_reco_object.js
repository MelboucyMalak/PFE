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

async function run() {
  // Let's register/login a temporary user to inspect a complete flow
  const email = `farmer_inspect_${Date.now()}@example.com`;
  const username = `farmer_inspect_${Date.now()}`;
  const password = "Password123!";
  
  try {
    console.log("1. Registering...");
    await makeRequest('https://torbati.onrender.com/api/sign-up', 'POST', { username, email, password });
    
    console.log("2. Logging in...");
    const loginRes = await makeRequest('https://torbati.onrender.com/api/login', 'POST', { email, password });
    const token = loginRes.data?.token || loginRes.data?.key;
    console.log("Token:", token);
    
    console.log("3. Creating a recommendation session in Algiers...");
    const recoRes = await makeRequest('https://torbati.onrender.com/api/recommendation', 'POST', {
      lat: 36.7,
      lon: 3.2
    }, token);
    const sessionId = recoRes.data?.recommendations?.id;
    console.log("Created Session ID:", sessionId);

    console.log("4. Fetching recommended crops...");
    const cropsRes = await makeRequest('https://torbati.onrender.com/api/crop-recommendation', 'POST', {
      session_id: sessionId
    }, token);
    const list = cropsRes.data?.["Crop List"] || cropsRes.data?.crop_list || cropsRes.data;
    const cropReco = list[0];
    console.log("Crop recommendation item keys:", Object.keys(cropReco));
    console.log("Crop recommendation item content:", JSON.stringify(cropReco, null, 2));

    console.log("5. Creating Field Analysis for the crop...");
    const polygon = [
      [36.701, 3.201],
      [36.699, 3.201],
      [36.699, 3.199],
      [36.701, 3.199]
    ];
    const fieldAnalysisRes = await makeRequest('https://torbati.onrender.com/api/field/analysis/', 'POST', {
      crop_recommendation: cropReco.id,
      polygon_coords: polygon,
      surface_area_m2: 1200
    }, token);
    console.log("Field Analysis status:", fieldAnalysisRes.status);
    console.log("Field Analysis response:", JSON.stringify(fieldAnalysisRes.data, null, 2));
    const fieldAnalysisId = fieldAnalysisRes.data?.field_analysis_id || fieldAnalysisRes.data?.id;

    console.log("6. Fetching recommended crops AGAIN to see if it now contains field analysis or if field analysis is fetched separate...");
    const cropsRes2 = await makeRequest('https://torbati.onrender.com/api/crop-recommendation', 'POST', {
      session_id: sessionId
    }, token);
    const list2 = cropsRes2.data?.["Crop List"] || cropsRes2.data?.crop_list || cropsRes2.data;
    console.log("Crop recommendation item keys after field analysis:", Object.keys(list2[0]));
    console.log("Crop recommendation item content after field analysis:", JSON.stringify(list2[0], null, 2));

  } catch (err) {
    console.error("Error:", err);
  }
}

run();
