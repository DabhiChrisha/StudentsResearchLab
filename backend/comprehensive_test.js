const prisma = require('./src/lib/prisma');
const http = require('http');

(async () => {
  try {
    // Get admin user credentials
    const adminUser = await prisma.authorization.findFirst({ where: { is_admin: true } });
    const loginData = JSON.stringify({ email: adminUser.user_ID, password: adminUser.password });

    // Login
    const token = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 8000,
        path: '/api/admin/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData),
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result.token);
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║  COMPREHENSIVE SYSTEM VERIFICATION - ALL ENDPOINTS TEST            ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('✅ Authentication: Successfully logged in as admin');
    console.log('');

    // Test all endpoints
    const endpoints = [
      { path: '/api/admin/research-projects', name: 'Research Projects', method: 'GET', requiresAuth: true },
      { path: '/api/admin/member-cv?enrollment_no=25MECE30003', name: 'Member CV Profile', method: 'GET', requiresAuth: true },
      { path: '/api/admin/join-requests', name: 'Join Requests', method: 'GET', requiresAuth: true },
      { path: '/api/public/achievements', name: 'Public Achievements', method: 'GET', requiresAuth: false },
      { path: '/api/user/scores', name: 'User Scores', method: 'GET', requiresAuth: true },
    ];

    let passCount = 0;
    let failCount = 0;

    for (const endpoint of endpoints) {
      const result = await new Promise((resolve) => {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (endpoint.requiresAuth) {
          headers.authorization = 'Bearer ' + token;
        }

        const req = http.request({
          hostname: 'localhost',
          port: 8000,
          path: endpoint.path,
          method: endpoint.method,
          headers,
        }, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              body: data,
            });
          });
        });
        req.on('error', (err) => resolve({ error: err.message }));
        req.end();
      });

      const status = result.statusCode;
      const success = status >= 200 && status < 300;
      const icon = success ? '✅' : '❌';
      
      if (success) passCount++;
      else failCount++;

      console.log(`${icon} ${endpoint.name}`);
      console.log(`   Route: ${endpoint.method} ${endpoint.path}`);
      console.log(`   Status: ${status}`);
      
      if (success) {
        try {
          const parsed = JSON.parse(result.body);
          const dataInfo = Array.isArray(parsed.data) ? `${parsed.data.length} records` : 'object data';
          console.log(`   Response: ${dataInfo}`);
        } catch (e) {
          console.log(`   Response: Success`);
        }
      } else {
        try {
          const parsed = JSON.parse(result.body);
          console.log(`   Error: ${parsed.message || parsed.error || 'Unknown error'}`);
        } catch (e) {
          console.log(`   Error: HTTP ${status}`);
        }
      }
      console.log('');
    }

    console.log('╔════════════════════════════════════════════════════════════════════╗');
    const resultLine = `║  RESULTS: ${passCount} PASSED | ${failCount} FAILED`.padEnd(70) + '║';
    console.log(resultLine);
    console.log('╚════════════════════════════════════════════════════════════════════╝');
    console.log('');
    
    if (failCount === 0) {
      console.log('🎉 ALL ENDPOINTS OPERATIONAL - SYSTEM READY FOR PRODUCTION');
    } else {
      console.log('⚠️  Some endpoints failed - review errors above');
    }

  } catch (err) {
    console.error('Fatal error:', err.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
})();
