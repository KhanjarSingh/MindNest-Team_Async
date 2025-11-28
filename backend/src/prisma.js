// Use CommonJS so existing `require`-based code keeps working.

const { PrismaClient } = require('../generated/prisma');

let ClientOptions = {};

// Try to use an adapter if there's a known adapter package installed.
// Replace '@prisma/adapter-mysql' with the adapter package you want to use (install it if necessary).
try {
  // NOTE: adjust the adapter package name to the actual adapter for MySQL that Prisma provides
  const AdapterFactory = require('@prisma/adapter-mysql');
  if (AdapterFactory && typeof AdapterFactory === 'function') {
    // Adapter factory style (if the adapter exports a constructor or factory).
    ClientOptions.adapter = new AdapterFactory(process.env.DATABASE_URL);
  } else if (AdapterFactory && AdapterFactory.create) {
    // Factory API style
    ClientOptions.adapter = AdapterFactory.create(process.env.DATABASE_URL);
  }
} catch (err) {
  // If there's no adapter available, do not fail — the runtime will fallback to prisma.config.js (used by Migrate/CLI).
  // If using Prisma Accelerate on Render or elsewhere, set PRISMA_ACCELERATE_URL environment variable.
}

if (process.env.PRISMA_ACCELERATE_URL) {
  ClientOptions.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
}

// Export a configured Prisma Client
const prisma = new PrismaClient(ClientOptions);

module.exports = prisma;
