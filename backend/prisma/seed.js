const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      id: 1,
      name: 'ADMIN',
    },
  });

  const participantRole = await prisma.role.upsert({
    where: { name: 'PARTICIPANT' },
    update: {},
    create: {
      id: 2,
      name: 'PARTICIPANT',
    },
  });

  console.log('Seeded roles:', { adminRole, participantRole });

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mindnest.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@mindnest.com',
      password: adminPassword,
      role: {
        connect: { id: 1 }
      },
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