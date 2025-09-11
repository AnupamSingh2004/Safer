// Check password hash
const bcrypt = require('bcryptjs');

async function checkPassword() {
    const password = 'admin123';
    const hash = '$2a$10$yPzNGKwTLKvOB9Lmy1QrBuJ5fKvx9zT8nVE2iOGhGQzVXpOzKdM9a';
    
    console.log('Testing password:', password);
    console.log('Against hash:', hash);
    
    const isValid = await bcrypt.compare(password, hash);
    console.log('Password valid:', isValid);
    
    // Generate a fresh hash
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash);
    
    // Test the new hash
    const isNewValid = await bcrypt.compare(password, newHash);
    console.log('New hash valid:', isNewValid);
}

checkPassword().catch(console.error);
