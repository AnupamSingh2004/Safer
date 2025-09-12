// Simple test script to verify frontend login works with different roles
const https = require('http');

const testCredentials = [
  {
    email: 'admin@touristsafety.gov.in',
    password: 'admin123',
    role: 'super_admin',
    name: 'Super Admin'
  },
  {
    email: 'operator@touristsafety.gov.in',
    password: 'operator123',
    role: 'operator',
    name: 'Operator'
  },
  {
    email: 'viewer@touristsafety.gov.in',
    password: 'viewer123',
    role: 'viewer',
    name: 'Viewer'
  }
];

async function testLogin(credentials) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(credentials);

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`\n🔐 Testing login for ${credentials.name} (${credentials.role}):`);
    console.log(`   Email: ${credentials.email}`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log(`   ✅ Login successful!`);
            console.log(`   👤 User: ${response.user.name}`);
            console.log(`   🔑 Role: ${response.user.role}`);
            console.log(`   🛡️  Permissions: ${response.user.permissions.join(', ')}`);
            
            // Expected navigation access based on role
            const expectedAccess = {
              'super_admin': ['Overview', 'Alerts', 'Analytics', 'Location', 'Communication', 'Advanced UI'],
              'operator': ['Overview', 'Alerts', 'Analytics', 'Location', 'Communication'],
              'viewer': ['Overview', 'Analytics']
            };
            
            console.log(`   📋 Expected Dashboard Access: ${expectedAccess[response.user.role].join(', ')}`);
            resolve(response);
          } else {
            console.log(`   ❌ Login failed: ${response.message}`);
            resolve(response);
          }
        } catch (err) {
          console.log(`   ⚠️  Error parsing response: ${err.message}`);
          reject(err);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ Request error: ${e.message}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Smart Tourist Safety System Login');
  console.log('================================================');
  
  try {
    for (const credentials of testCredentials) {
      await testLogin(credentials);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ All login tests completed!');
    console.log('\n📋 Role-Based Access Summary:');
    console.log('   • Super Admin: Full access to all dashboard features');
    console.log('   • Operator: Access to alerts, analytics, location, and communication');
    console.log('   • Viewer: Read-only access to overview and analytics');
    
    console.log('\n🌐 You can now test the frontend at: http://localhost:8001/login');
    console.log('   Use the quick demo buttons or enter credentials manually.');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

runTests();