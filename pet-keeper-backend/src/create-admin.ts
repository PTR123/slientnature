import bcrypt from 'bcryptjs';
import prisma from './lib/prisma.js';

async function createAdmin() {
  try {
    // 检查是否已存在管理员
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('❌ Admin already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.username}`);
      return;
    }

    // 创建超管账号
    const email = 'admin@petkeeper.com';
    const username = 'admin';
    const password = 'Admin123456'; // 可以修改为更安全的密码
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'admin',
        isBanned: false
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true
      }
    });

    console.log('✅ Super admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', admin.email);
    console.log('👤 Username: ', admin.username);
    console.log('🔑 Password: ', password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('Failed to create admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();