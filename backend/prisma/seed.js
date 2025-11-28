const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create roles
  await prisma.role.upsert({
    where: { id: 0 },
    update: {},
    create: { id: 0, name: 'STUDENT' },
  });

  await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'INSTRUCTOR' },
  });

  // Create admin user
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

  console.log('Seeded roles and admin user:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });