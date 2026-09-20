import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus, Role } from 'generated/prisma/enums';
import { CreateAppointmentResponseDto } from './dto/create-appointment-responses.dto';

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly prismaService : PrismaService
    ) {}
    
    async createAppointment(currentUser: ActiveUserData, createAppointmentDto : CreateAppointmentDto): Promise<CreateAppointmentResponseDto> {
        // 1. Get pet data and the owner
        const pet = await this.prismaService.pet.findFirst({
            where: {
                id: createAppointmentDto.petId,
            },
            include: {
                owner: true
            },
        });

        if (!pet) {
            throw new NotFoundException(`Pet with ID ${createAppointmentDto.petId} not found`);
        }
        // get ownerId automatic from pet data
        const targetOwnerId = pet.ownerId


        // 2. Validate based on ROLE
        let targetDoctorId: number = 0;

        if (currentUser.role === Role.OWNER) {
            // A. If role is Owner
            // Make sure userId on petOwner is the same with userId with the credential currently login
            if (pet.ownerId !== currentUser.id) {
                throw new ForbiddenException('You can only create an appointment for your own pet')
            };

            if (createAppointmentDto.doctorId) {
            const doctor = await this.prismaService.doctor.findUnique({
                where: { id: createAppointmentDto.doctorId },
            });
            if (!doctor) {
                throw new NotFoundException(`Doctor with ID ${createAppointmentDto.doctorId} not found`);
            }
            targetDoctorId = createAppointmentDto.doctorId;
        }

        } else if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN) {
            // B. if the role is Admin or Super Admin:
            // Admin is mandatory to choose docter while make an appointment
            if (!createAppointmentDto.doctorId) {
                throw new BadRequestException('doctorId is required when created by Admin')
            }

            const doctor = await this.prismaService.doctor.findUnique({
                where: { id: createAppointmentDto.doctorId }
            });

            if (!doctor) {
                throw new NotFoundException(`Doctor with ID ${createAppointmentDto.doctorId} not found`)
            }
            targetDoctorId = createAppointmentDto.doctorId
        } else {
            throw new ForbiddenException('You are not allowed to create an appointment');
        }

        // 3. Generate unique code appointment
        const randomCode = Math.floor(10000000 + Math.random() * 90000000)
        const appointmentCode = `APPT-${randomCode}` 


        // 4. save into database
        const newAppointment = await this.prismaService.appointment.create({
            data: {
                appointmentCode: appointmentCode,
                petId: createAppointmentDto.petId,
                ownerId: targetOwnerId, // Auto-assigned dari Pet
                doctorId: targetDoctorId,
                serviceType: createAppointmentDto.serviceType,
                appointmentDate: createAppointmentDto.appointmentDate,
                appointmentTime: createAppointmentDto.appointmentTime,
                complaint: createAppointmentDto.complaint,
                status: currentUser.role === Role.OWNER 
                ? AppointmentStatus.CONFIRMED
                : AppointmentStatus.IN_PROGRESS, // Otomatis Confirmed jika dibuat oleh Admin
            },
        });
            
        return {
            status: 201,
            messages: 'Succesfully created appointment',
            data: {
                id: newAppointment.id,
                appointmentCode: newAppointment.appointmentCode,
                petId: newAppointment.petId,
                ownerId: newAppointment.ownerId,
                doctorId: newAppointment.doctorId,
                serviceType: newAppointment.serviceType,
                transportFee: newAppointment.transportFee ? newAppointment.transportFee.toNumber() : null,
                status: newAppointment.status,
                appointmentDate: newAppointment.appointmentDate instanceof Date 
                    ? newAppointment.appointmentDate.toISOString().split('T')[0] 
                    : String(newAppointment.appointmentDate),
                appointmentTime: newAppointment.appointmentTime,
                complaint: newAppointment.complaint ?? '',
            },
        }
    }
}
