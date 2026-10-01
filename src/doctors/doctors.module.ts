import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  providers: [DoctorsService, PrismaService],
  controllers: [DoctorsController]
})
export class DoctorsModule {}
