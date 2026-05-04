const prisma = require('./src/lib/prisma');
const http = require('http');

(async () => {
  try {
    // Get a valid user to login
    const row = await prisma.authorization.findFirst();
    const loginData = JSON.stringify({ email: row.user_ID, password: row.password });

    // Get token
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

    console.log('✅ Got token');

    // Test member-cv with correct enrollment_no
    const result = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 8000,
        path: '/api/admin/member-cv?enrollment_no=25MECE30003',
        method: 'GET',
        headers: {
          'authorization': 'Bearer ' + token,
        },
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

    console.log('\n/api/admin/member-cv?enrollment_no=25MECE30003:');
    console.log(`Status: ${result.statusCode}`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    } else if (result.statusCode === 200) {
      const parsed = JSON.parse(result.body);
      console.log('✅ Success');
      console.log('Data:', JSON.stringify(parsed, null, 2).substring(0, 400));
    } else {
      console.log(`Response: ${result.body.substring(0, 300)}`);
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
})();
