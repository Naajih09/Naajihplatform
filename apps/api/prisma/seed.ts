
import { ConnectionStatus, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

  console.log('Seeding users...');

  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@naajih.com' },
    update: {},
    create: {
      email: 'admin@naajih.com',
      password,
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  // 2. Investor
  const investor = await prisma.user.upsert({
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
  const entrepreneur = await prisma.user.upsert({
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
  const aspirant = await prisma.user.upsert({
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
  const pitch = await prisma.pitch.create({
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
  await prisma.connection.upsert({
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
    await prisma.$disconnect();
  });
