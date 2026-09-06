// src/seeder/seeder.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [CommonModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
