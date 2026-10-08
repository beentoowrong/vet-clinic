import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CodeGenerator } from 'src/common/utils/code.generator';

@Module({
  providers: [MedicalRecordsService, PrismaService, CodeGenerator],
  controllers: [MedicalRecordsController]
})
export class MedicalRecordsModule {}
