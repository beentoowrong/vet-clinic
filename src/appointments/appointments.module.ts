import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AppointmentValidator } from './validators/appointment.validator';
import { CodeGenerator } from 'src/common/utils/code.generator';

@Module({
  providers: [AppointmentsService, AppointmentValidator, PrismaService, CodeGenerator],
  controllers: [AppointmentsController]
})
export class AppointmentsModule {}
