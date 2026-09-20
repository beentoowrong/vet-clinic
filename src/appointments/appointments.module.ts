import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  providers: [AppointmentsService, PrismaService],
  controllers: [AppointmentsController]
})
export class AppointmentsModule {}
