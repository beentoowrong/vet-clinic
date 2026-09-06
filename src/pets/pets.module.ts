import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  providers: [PetsService, PrismaService],
  controllers: [PetsController],
})
export class PetsModule {}
