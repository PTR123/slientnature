import bcrypt from 'bcryptjs';

async function testPassword() {
  const hashedPassword = '$2a$10$Ca5wlvPnZmssyA8xCNgKhupboFpZGVqLEdVb5NZ.qwG64oTtMXhgi';
  const isValid = await bcrypt.compare('password123', hashedPassword);
  console.log('Password valid:', isValid);
}

testPassword();