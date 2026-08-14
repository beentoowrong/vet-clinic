import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeederModule } from './seeder/seeder.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonLogger, WinstonModule } from 'nest-winston';
import * as winston from 'winston'


@Module({
  imports: [
    CommonModule, 
    AuthModule, 
    UsersModule, 
    SeederModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
