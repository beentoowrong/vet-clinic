import { Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Role } from 'generated/prisma/enums';


@Injectable()
export class AppointmentsService {
    constructor(private readonly prismaService : PrismaService) {}
    

    async createAppointment(currentUser: ActiveUserData, createAppointmentDto : CreateAppointmentDto): Promise<> {
        let ownerId: number;

        if (currentUser.role === Role.OWNER) {
            const petOwner = await this.prismaService.petOwner.findUnique({
                where: { userId: currentUser.id }
            });
            ownerId = petOwner?.id
        } else {
            const pet = await this.prismaService.pet.findUnique({
                where: { id: createAppointmentDto.petId },
                select: { ownerId: true }
            });
            ownerId = pet.ownerId
        }

        const doctorId = this.createAppointment.doctorId
    }
}
