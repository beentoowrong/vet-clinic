// src/seeder/seeder.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { SeederService } from 'src/seeder/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}