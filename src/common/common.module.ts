import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CodeGenerator } from './utils/code.generator';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, CodeGenerator],
  exports: [PrismaService, CodeGenerator],
})
export class CommonModule {}
