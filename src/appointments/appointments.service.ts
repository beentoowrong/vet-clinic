import { Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Role } from 'generated/prisma/enums';
import { CreateAppointmentResponseDto } from './dto/create-appointment-responses.dto';

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly prismaService : PrismaService
    ) {}
    
    async createAppointment(currentUser: ActiveUserData, createAppointmentDto : CreateAppointmentDto): Promise<CreateAppointmentResponseDto> {

    }
}
