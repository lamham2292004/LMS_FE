#!/usr/bin/env node

const https = require('https');
const http = require('http');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function checkBackend() {
  console.log('🔍 Checking backend connection...');
  console.log(`📍 API URL: ${API_URL}`);
  
  const endpoints = [
    { name: 'Health Check', path: '/health' },
    { name: 'API Root', path: '/' },
    { name: 'Login Endpoint', path: '/v1/login' },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n⏳ Testing ${endpoint.name}...`);
      const result = await makeRequest(`${API_URL}${endpoint.path}`);
      
      if (result.success) {
        console.log(`✅ ${endpoint.name}: OK (${result.status})`);
        if (result.data) {
          console.log(`   Response: ${JSON.stringify(result.data).substring(0, 100)}...`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: FAILED - ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ERROR - ${error.message}`);
    }
  }

  console.log('\n🏁 Backend check completed!');
}

function makeRequest(url) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            success: true,
            status: res.statusCode,
            data: jsonData
          });
        } catch (e) {
          resolve({
            success: true,
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

// Run the check
checkBackend().catch(console.error);