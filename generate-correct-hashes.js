const bcrypt = require('bcryptjs');

console.log('Generating correct password hashes...\n');

const passwords = {
  'admin123': '$2a$10$Mxn7jZOBm3ZBYIfQel6/O.I1INZIQVDWz6YLPWCu5wK/kX875QbuC',
  'operator123': '$2a$10$JnypgARsABQ6B4xtFGZ/9.K9MFHFbsCaCEqlT0UAZu4ODeZzqnbya',
  'viewer123': '$2a$10$OQsHSFQYfOzD5VQDzRWH4u1BtWCcdy6TEusWNvoyKxjfG7B.2/IDm',
  'police123': bcrypt.hashSync('police123', 10),
  'tourism123': bcrypt.hashSync('tourism123', 10)
};

Object.entries(passwords).forEach(([password, hash]) => {
  console.log(`${password}: ${hash}`);
});

console.log('\nTesting verification...');
console.log('police123 verification:', bcrypt.compareSync('police123', passwords['police123']));
console.log('tourism123 verification:', bcrypt.compareSync('tourism123', passwords['tourism123']));