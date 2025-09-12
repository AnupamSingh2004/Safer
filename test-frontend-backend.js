/**
 * Test Frontend-Backend Integration
 * Tests that all three user roles can login successfully
 */

const https = require('http');

const testAccounts = [
  {
    name: 'Super Admin',
    email: 'admin@touristsafety.gov.in',
    password: 'admin123',
    role: 'super_admin'
  },
  {
    name: 'System Operator',
    email: 'operator@touristsafety.gov.in',
    password: 'operator123',
    role: 'operator'
  },
  {
    name: 'Safety Viewer',
    email: 'viewer@touristsafety.gov.in',
    password: 'viewer123',
    role: 'viewer'
  }
];

async function testLogin(account) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: account.email,
      password: account.password,
      role: account.role
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'http://localhost:8001'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: response,
            account: account.name
          });
        } catch (err) {
          reject(new Error(`Parse error for ${account.name}: ${err.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Request error for ${account.name}: ${e.message}`));
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🔐 Testing Smart Tourist Safety System Login Integration\n');
  console.log('Backend: http://localhost:3001');
  console.log('Frontend: http://localhost:8001\n');
  
  let passedTests = 0;
  let totalTests = testAccounts.length;

  for (const account of testAccounts) {
    try {
      console.log(`Testing ${account.name} (${account.role})...`);
      
      const result = await testLogin(account);
      
      if (result.status === 200 && result.data.success) {
        console.log(`✅ ${account.name}: Login successful`);
        console.log(`   Token received: ${result.data.token ? 'Yes' : 'No'}`);
        console.log(`   User data: ${result.data.user ? result.data.user.name : 'None'}`);
        console.log(`   Permissions: ${result.data.user?.permissions?.length || 0}\n`);
        passedTests++;
      } else {
        console.log(`❌ ${account.name}: Login failed`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Message: ${result.data.message || 'Unknown error'}\n`);
      }
    } catch (error) {
      console.log(`❌ ${account.name}: ${error.message}\n`);
    }
  }

  console.log('📊 Test Results:');
  console.log(`   Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your frontend and backend are properly connected.');
    console.log('\n📝 Next Steps:');
    console.log('   1. Visit http://localhost:8001/login');
    console.log('   2. Click any "Demo Login" button to test');
    console.log('   3. You should be redirected to dashboard after login');
    console.log('   4. Each role will have different permissions and views');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your backend configuration.');
  }
}

runTests().catch(console.error);