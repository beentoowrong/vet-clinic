import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL not found');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: dbUrl }),
});

async function main() {
  console.log('Seeding...');

  // Seed super admin
  const email = process.env.SUPER_ADMIN_EMAIL;
  const rawPassword = process.env.SUPER_ADMIN_PASSWORD;
  if (!email || !rawPassword) throw new Error('SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD missing in .env');

  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Alica Putri Azzahra',
      email,
      password: hashedPassword,
      phoneNumber: '083245678911',
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`User ${email} seeded`);

  // Seed species & breeds
  const speciesData = [
    { name: 'Dog', breeds: ['Labrador', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle'] },
    { name: 'Cat', breeds: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'] },
    { name: 'Bird', breeds: ['Canary', 'Budgerigar', 'Cockatiel', 'Lovebird'] },
    { name: 'Rabbit', breeds: ['Holland Lop', 'Netherland Dwarf', 'Angora'] },
    { name: 'Hamster', breeds: ['Syrian', 'Dwarf Winter White', 'Campbell'] },
  ];

  for (const s of speciesData) {
    const species = await prisma.species.upsert({
      where: { name: s.name },
      update: {},
      create: { name: s.name },
    });
    for (const breedName of s.breeds) {
      await prisma.breed.upsert({
        where: { name_speciesId: { name: breedName, speciesId: species.id } },
        update: {},
        create: { name: breedName, speciesId: species.id },
      });
    }
    console.log(`${species.name}: ${s.breeds.length} breeds`);
  }

  await prisma.$disconnect();
  console.log('Seeding complete!');
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
