import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  providers: [BreedsService, PrismaService],
  controllers: [BreedsController],
})
export class BreedsModule {}
