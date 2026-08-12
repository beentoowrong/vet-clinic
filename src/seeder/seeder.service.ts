import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt'
import { Role } from 'generated/prisma/enums';
import { ConfigService } from '@nestjs/config';

dotenv.config()

@Injectable()
export class SeederService {
    // Logger bawaan 
    private readonly logger = new Logger(SeederService.name)

    constructor(
        private readonly prismaService : PrismaService, 
        private configService : ConfigService,
    ) {}

    // Method publik utama untuk menjalankan seluruh proses seeding
    async seed() {
        this.logger.log('Starting seeding process')

        await this.seedUsers();

        this.logger.log('Seeding Completed')
    }

    private async seedUsers() {
        this.logger.log('Seeding user')

        const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
        const rawPassword = this.configService.get<string>('SUPER_ADMIN_PASSWORD');
        const name = 'Alica Putri Azzahra';
        const phoneNumber = '083245678911';

        if (!superAdminEmail || !rawPassword) {
            throw new Error('SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD should in .env file!');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(rawPassword, saltRounds)

        const super_admin = await this.prismaService.user.upsert({
            where: {
                email: superAdminEmail
            },
            update: {},
            create: {
                name: name,
                email: superAdminEmail,
                password: hashedPassword,
                phoneNumber: phoneNumber,
                role: Role.SUPER_ADMIN,
            }
        });

        this.logger.log(`Super Admin user created/existed: ${super_admin.email}`)
    }
}
