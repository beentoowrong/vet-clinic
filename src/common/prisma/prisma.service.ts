import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions> implements OnModuleInit, OnModuleDestroy{
    constructor(
        configService : ConfigService,
    ) {
        const adapter = new PrismaPg({
            connectionString: configService.get<string>('DATABASE_URL')
        })
        super({ adapter })
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
