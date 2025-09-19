const bcrypt = require('bcryptjs');

console.log('police123:', bcrypt.hashSync('police123', 10));
console.log('tourism123:', bcrypt.hashSync('tourism123', 10));