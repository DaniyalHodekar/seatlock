import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

process.loadEnvFile();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const organiser = await prisma.user.create({
    data: {
      email: 'organiser@seed.test',
      passwordHash: 'x',
      role: 'organiser',
    },
  });

  await prisma.event.createMany({
    data: [
      {
        title: 'Indie Night',
        venue: 'Phoenix Hall',
        startsAt: new Date('2026-12-01T19:00:00+05:30'),
        organiserId: organiser.id,
      },
      {
        title: 'Jazz Evening',
        venue: 'Blue Room',
        startsAt: new Date('2026-12-05T20:00:00+05:30'),
        organiserId: organiser.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
