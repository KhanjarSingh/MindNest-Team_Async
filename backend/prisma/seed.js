const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user (roles already exist from migration)
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mindnest.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@mindnest.com',
      password: adminPassword,
      roleId: 1,
      is_verified: true,
    },
  });

  console.log('Seeded admin user:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });