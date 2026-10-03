import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "src/common/enum/role.enum";
import { PrismaService } from "src/common/prisma/prisma.service";
import { UpdateAppointmentDto } from "../dto/update-appointment.dto";
import { AppointmentStatus, InvoiceType } from "generated/prisma/enums";



@Injectable()
export class AppointmentValidator {
    constructor (
        private readonly prismaService : PrismaService
    ) {}
    
    async validatePetExist(petId: number) {
        const pet = await this.prismaService.pet.findUnique({
            where: { id: petId},
            select: { id: true, ownerId: true }
        })

        if (!pet) {
            throw new NotFoundException(`Pet with ID ${petId} not found`)
        }

        return pet
    }

    async validateOwnerAccess(userId: number, petOwnerId: number) {
        const petOwner = await this.prismaService.petOwner.findUnique({
            where : { userId }
        })

        // Kalau pet owner gak ada atau pet owner id TIDAK SAMA DENGAN id user login
        if (!petOwner || petOwner.id !== petOwnerId) {
            throw new ForbiddenException ('You can only access your own pet')
        }

        return petOwner;
    }

    async validateDoctorExist(doctorId: number) {
        const doctor = await this.prismaService.doctor.findUnique({
            where: { id: doctorId },
        })

        if (!doctor) {
            throw new NotFoundException(`Pet with ID ${doctorId} not found`)
        }
    }

    validateAdminDoctorRequirement(role: Role, doctorId: number) {
        if ((role === Role.ADMIN || role === Role.SUPER_ADMIN) && !doctorId) {
            throw new BadRequestException('DoctorId is required when created by Admin')
        }
    }

    validateCreateRole(role: Role) {
        if (![Role.OWNER, Role.ADMIN, Role.SUPER_ADMIN].includes(role)) {
            throw new ForbiddenException('You are not allowed to create an appointment');
        }
    }

    // Validator for UPDATE function service
    // Appointment existence
    async validateAppointmentExists(appointmentId: number) {
        const appointment = await this.prismaService.appointment.findUnique({
            where: { id: appointmentId },
            select: {
                id: true,
                ownerId: true,
                serviceType: true,
                appointmentDate: true
            },
        })

        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${appointmentId} not found`)
        }

        return appointment;
    }

    // Owner can not update in certain field
    validateOwnerRestrictedFields(updateAppointmentDto : UpdateAppointmentDto) {
        if (
            updateAppointmentDto.doctorId !== undefined ||
            updateAppointmentDto.appointmentStatus !== undefined ||
            updateAppointmentDto.invoiceStatus !== undefined ||
            updateAppointmentDto.transportFee !== undefined
        ) {
            throw new ForbiddenException('This field can only be updated by Admin')
        }
    }

    // Owner can only update their own animals
    async validateAppointmentOwnership(userId: number, ownerId: number) {
        const petOwner = await this.prismaService.petOwner.findUnique({
            where: { userId }
        })

        if (!petOwner || petOwner.id !== ownerId) {
            throw new ForbiddenException('You can only update your own appointment')
        }

        return petOwner;
    }

    // Validator for DELETE function service
    async validateCancelableAppointment (appointmentId: number) {
        const appointment = await this.prismaService.appointment.findUnique({
            where: { id: appointmentId },
            select: { 
                id: true, 
                ownerId: true,
                status: true,
                appointmentCode: true
            }
        })

        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${appointmentId} not found`)
        }

        if (appointment.status === AppointmentStatus.COMPLETED) {
            throw new BadRequestException('Completed appointment cannot be cancelled');
        }

        if (appointment.status === AppointmentStatus.IN_PROGRESS) {
            throw new BadRequestException('In Progress appointment cannot be cancelled');
        }

        if (appointment.status === AppointmentStatus.CANCELLED) {
            throw new BadRequestException('Appointment is already cancelled');
        }

        return appointment;
    }

    validateCancelPermission(role: Role) {
        if (![Role.OWNER, Role.ADMIN, Role.SUPER_ADMIN].includes(role)) {
            throw new ForbiddenException('You are not allowed to cancel an appointment');
        }
    }

    async validateInvoiceExists(appointmentId: number) {
        const invoice = await this.prismaService.invoice.findFirst({
            where: { appointmentId, type: InvoiceType.DP_TRANSPORT },
        });

        if (!invoice) {
            throw new BadRequestException('This appointment has no invoice yet');
        }

        return invoice;
    }
}