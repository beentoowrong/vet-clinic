import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma/enums';
dotenv.config();

@Injectable()
export class SeederService {
  // Logger bawaan
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly prismaService: PrismaService) {}

  // Method publik utama untuk menjalankan seluruh proses seeding
  async seed() {
    this.logger.log('Starting seeding process');

    await this.seedUsers();
    await this.seedSpeciesAndBreeds();

    this.logger.log('Seeding Completed');
  }

  private async seedUsers() {
    this.logger.log('Seeding user');

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const rawPassword = process.env.SUPER_ADMIN_PASSWORD;
    const name = 'Alica Putri Azzahra';
    const phoneNumber = '083245678911';

    if (!superAdminEmail || !rawPassword) {
      throw new Error(
        'SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD should in .env file!',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    const super_admin = await this.prismaService.user.upsert({
      where: {
        email: superAdminEmail,
      },
      update: {},
      create: {
        name: name,
        email: superAdminEmail,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        role: Role.SUPER_ADMIN,
      },
    });

    this.logger.log(`Super Admin user created/existed: ${super_admin.email}`);
  }

  private async seedSpeciesAndBreeds() {
    this.logger.log('Seeding species and breeds');

    const speciesData = [
      {
        name: 'Dog',
        breeds: ['Labrador', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle'],
      },
      {
        name: 'Cat',
        breeds: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'],
      },
      {
        name: 'Bird',
        breeds: ['Canary', 'Budgerigar', 'Cockatiel', 'Lovebird'],
      },
      {
        name: 'Rabbit',
        breeds: ['Holland Lop', 'Netherland Dwarf', 'Angora'],
      },
      {
        name: 'Hamster',
        breeds: ['Syrian', 'Dwarf Winter White', 'Campbell'],
      },
    ];

    for (const species of speciesData) {
      const created = await this.prismaService.species.upsert({
        where: { name: species.name },
        update: {},
        create: { name: species.name },
      });

      for (const breedName of species.breeds) {
        await this.prismaService.breed.upsert({
          where: {
            name_speciesId: { name: breedName, speciesId: created.id },
          },
          update: {},
          create: { name: breedName, speciesId: created.id },
        });
      }

      this.logger.log(`Species "${species.name}" with ${species.breeds.length} breeds seeded`);
    }
  }
}
