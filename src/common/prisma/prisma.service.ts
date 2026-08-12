import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService?: ConfigService) {
    // Ambil DATABASE_URL dari configService jika ada, atau fallback ke process.env
    const dbUrl =
      configService?.get<string>('DATABASE_URL') || process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error('DATABASE_URL tidak ditemukan di environment!');
    }

    const adapter = new PrismaPg({
      connectionString: dbUrl,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}