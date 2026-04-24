
import 'dotenv/config';
import { ConnectionStatus, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

let seedPrisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@naajih.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Password123!';
  const password = await bcrypt.hash(adminPassword, 10);
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL or DIRECT_URL must be set for seeding.');
  }

  seedPrisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  console.log('Seeding users...');

  // 1. Admin
  const admin = await seedPrisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password,
      role: UserRole.ADMIN,
      isVerified: true,
      emailVerified: true,
      isActive: true,
    },
    create: {
      email: adminEmail,
      password,
      role: UserRole.ADMIN,
      isVerified: true,
      emailVerified: true,
    },
  });

  // 2. Investor
  const investor = await seedPrisma.user.upsert({
    where: { email: 'investor@naajih.com' },
    update: {},
    create: {
      email: 'investor@naajih.com',
      password,
      role: UserRole.INVESTOR,
      isVerified: true,
      investorProfile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          organization: 'Naajih Capital',
          minTicketSize: 10000,
          maxTicketSize: 500000,
          focusIndustries: ['Tech', 'Agriculture'],
        },
      },
    },
  });

  // 3. Entrepreneur
  const entrepreneur = await seedPrisma.user.upsert({
    where: { email: 'entrepreneur@naajih.com' },
    update: {},
    create: {
      email: 'entrepreneur@naajih.com',
      password,
      role: UserRole.ENTREPRENEUR,
      isVerified: true,
      entrepreneurProfile: {
        create: {
          firstName: 'Jane',
          lastName: 'Smith',
          businessName: 'EcoPower Solutions',
          industry: 'Energy',
          stage: 'Seed',
          location: 'Lagos, Nigeria',
        },
      },
    },
  });

  // 4. Aspiring Business Owner
  const aspirant = await seedPrisma.user.upsert({
    where: { email: 'aspirant@naajih.com' },
    update: {},
    create: {
      email: 'aspirant@naajih.com',
      password,
      role: UserRole.ASPIRING_BUSINESS_OWNER,
      isVerified: true,
    },
  });

  console.log('Seeding opportunity (Pitch)...');

  // 5. Pitch for Entrepreneur
  const pitch = await seedPrisma.pitch.create({
    data: {
      userId: entrepreneur.id,
      title: 'Solar for All',
      tagline: 'Affordable clean energy for rural communities',
      problemStatement: 'Lack of reliable power in rural areas hindering economic growth.',
      solution: 'Portable solar kits with pay-as-you-go financing.',
      traction: '100 pilot households onboarded.',
      marketSize: '$10B TAM',
      fundingAsk: '$250k',
      equityOffer: '10%',
      category: 'Energy',
    },
  });

  console.log('Seeding connection...');

  // 6. Connection between Investor and Entrepreneur
  await seedPrisma.connection.upsert({
    where: {
      senderId_receiverId: {
        senderId: investor.id,
        receiverId: entrepreneur.id,
      },
    },
    update: {},
    create: {
      senderId: investor.id,
      receiverId: entrepreneur.id,
      status: ConnectionStatus.PENDING,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedPrisma.$disconnect();
  });
