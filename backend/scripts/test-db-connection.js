// backend/scripts/test-db-connection.js

const { getDatabase } = require('../src/lib/database.ts');

/**
 * Test database connection and display health statistics
 */
async function testConnection() {
  console.log('🧪 Testing database connection...');
  
  try {
    const db = getDatabase();
    await db.connect();
    
    console.log('✅ Database connected successfully!');
    
    // Get health stats
    const health = await db.getHealthStats();
    console.log('📊 Database Health Statistics:');
    console.log(JSON.stringify(health, null, 2));
    
    // Test a simple query
    const result = await db.query('SELECT NOW() as current_time, version() as version');
    console.log('⏰ Current Time:', result.data[0]?.current_time);
    console.log('🐘 PostgreSQL Version:', result.data[0]?.version?.substring(0, 50) + '...');
    
    await db.disconnect();
    console.log('👋 Database disconnected');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
}

// Run test if called directly
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };