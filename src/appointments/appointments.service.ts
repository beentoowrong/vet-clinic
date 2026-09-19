import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
        let targetOwnerId: number;
        let targetDoctorId: number | null = null;

        // Cek role dan penentuan ID (OWNER atau ADMIN)
        if (currentUser.role === Role.OWNER) {
            // if the role is owner, find petOwner data based userId from login token
            const petOwner = await this.prismaService.petOwner.findUnique({
                where : { userId: currentUser.id }
            })

            if (!petOwner) {
                throw new NotFoundException('Pet owner profile not found')
            }

            targetOwnerId = petOwner.id

            // Make sure if the pet that registered it is right pet owner
            const pet = await this.prismaService.pet.findFirst({
                where: {
                    id : createAppointmentDto.petId,
                    ownerId: targetOwnerId,
                    deletedAt: null
                }
            });

            if (!pet) {
                throw new ForbiddenException('Pet does not belong to you or does not exist')
            }
        } else if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN) {
            // if the role is ADMIN or SUPER ADMIN, fill the ownerId and doctorId
        }
    }
}
