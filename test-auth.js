// Test authentication for all user roles
const testCredentials = [
  { email: 'admin@touristsafety.gov.in', password: 'admin123', role: 'super_admin', name: 'Admin' },
  { email: 'operator@touristsafety.gov.in', password: 'operator123', role: 'operator', name: 'Operator' },
  { email: 'viewer@touristsafety.gov.in', password: 'viewer123', role: 'viewer', name: 'Viewer' },
  { email: 'police@touristsafety.gov.in', password: 'police123', role: 'police_admin', name: 'Police' },
  { email: 'tourism@touristsafety.gov.in', password: 'tourism123', role: 'tourism_admin', name: 'Tourism' }
];

async function testAuth() {
  console.log('Testing authentication for all user roles...\n');
  
  for (const cred of testCredentials) {
    try {
      console.log(`Testing ${cred.name} login...`);
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cred.email,
          password: cred.password,
          role: cred.role
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${cred.name} login successful - Role: ${result.user.role}`);
      } else {
        console.log(`❌ ${cred.name} login failed: ${result.message}`);
      }
    } catch (error) {
      console.log(`❌ ${cred.name} login error: ${error.message}`);
    }
    console.log('');
  }
}

testAuth();