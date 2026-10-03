import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AppointmentValidator } from './validators/appointment.validator';

@Module({
  providers: [AppointmentsService, AppointmentValidator, PrismaService],
  controllers: [AppointmentsController]
})
export class AppointmentsModule {}
