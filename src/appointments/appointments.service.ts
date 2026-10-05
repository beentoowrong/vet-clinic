import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus, InvoiceStatus, InvoiceType, Role, ServiceType } from 'generated/prisma/enums';
import { CreateAppointmentResponseDto } from './dto/create-appointment-responses.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { PaginationDto } from './dto/pagination.dto'
import { PaginatedAppointmentsResponseDto } from './dto/pagination-appointment-response.dto';
import { AppointmentValidator } from './validators/appointment.validator';
import { CodeGenerator } from 'src/common/utils/code.generator';
import { InvoiceHelper } from './helper/invoice.helper';
import { buildWhereCondition } from './helper/appointment-query.helper';
import { formatAppointment } from './helper/appointment-mapper.helper';
import { appointmentSelect } from './constants/appointment-select';

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly prismaService : PrismaService,
        private readonly appointmentValidator : AppointmentValidator,
        private readonly codeGenerator: CodeGenerator,
        private readonly invoiceHelper: InvoiceHelper
    ) {}
    
    async createAppointment(currentUser: ActiveUserData, createAppointmentDto : CreateAppointmentDto): Promise<CreateAppointmentResponseDto> {
        // Step 1. Cari pet, 404 kalau tidak ada. ownerId diambil dari pet.
        const pet = await this.appointmentValidator.validatePetExist(createAppointmentDto.petId)
        const targetOwnerId = pet.ownerId;

        // Step 2. Branching berdasarkan role untuk doctorId.
        let targetDoctorId: number | null = null;
        

        if (currentUser.role === Role.OWNER) {
            // OWNER: hanya pet sendiri. doctorId dari body diabaikan,
            // dokter di-assign admin belakangan.
            await this.appointmentValidator.validateOwnerAccess(currentUser.id, pet.ownerId)
            targetDoctorId = null;
            
        } else if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN) {
            // ADMIN: semua pet boleh, tapi doctorId wajib (400 kalau kosong).
            this.appointmentValidator.validateAdminDoctorRequirement(
                currentUser.role,
                createAppointmentDto.doctorId
            )

            await this.appointmentValidator.validateDoctorExist(createAppointmentDto.doctorId!)
            targetDoctorId = createAppointmentDto.doctorId!;

        
        } else {
            await this.appointmentValidator.validateCreateRole(currentUser.role)
        }

        // Step 3. Generate kode unik appointment.
        const appointmentCode = await this.codeGenerator.generateUniqueCode('APPT')



        // Step 4. Simpan ke database.
        const newAppointment = await this.prismaService.appointment.create({
            data: {
                appointmentCode,
                petId: createAppointmentDto.petId,
                ownerId: targetOwnerId,
                doctorId: targetDoctorId,
                serviceType: createAppointmentDto.serviceType,
                appointmentDate: new Date(createAppointmentDto.appointmentDate),
                appointmentTime: createAppointmentDto.appointmentTime,
                complaint: createAppointmentDto.complaint,
                status: currentUser.role === Role.OWNER 
                ? AppointmentStatus.WAITING_FOR_PAYMENT
                : AppointmentStatus.CONFIRMED,
            },
        });
            
        // 5. HOME_VISIT langsung buatkan invoice DP, IN_CLINIC null (kasir nanti).
        let invoice: { 
            id: number; 
            invoiceNumber: string; 
            totalAmount: number; 
            status: InvoiceStatus; 
            paymentDueDate: Date 
        } | null = null;

        const invoiceCode = await this.codeGenerator.generateUniqueCode('INV')

        if (createAppointmentDto.serviceType === ServiceType.HOME_VISIT) {
            const newInvoice = await this.prismaService.invoice.create({
                data: {
                    invoiceNumber: invoiceCode,
                    appointmentId: newAppointment.id,
                    type: InvoiceType.DP_TRANSPORT,
                    description: 'Down payment for home visit travel expenses',
                    totalAmount: 0, // diisi admin via transportFee setelah cek jarak
                    paymentDueDate: new Date(createAppointmentDto.appointmentDate),
                },
                select: { id: true, invoiceNumber: true, totalAmount: true, status: true, paymentDueDate: true },
            });
            invoice = { ...newInvoice, totalAmount: newInvoice.totalAmount.toNumber() };
        }

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
                invoice,
            },
        }
    }

    async updateAppointment(currentUser: ActiveUserData, appointmentId: number, updateAppointmentDto : UpdateAppointmentDto) {
        // 1. Cari dulu appointment ID
        const existing = await this.appointmentValidator.validateAppointmentExists(appointmentId)

        const data : any = {};

        if(currentUser.role === Role.OWNER) {
            this.appointmentValidator.validateOwnerRestrictedFields(updateAppointmentDto)
            await this.appointmentValidator.validateAppointmentOwnership(currentUser.id, existing.ownerId)

            // Owner: ganti petId wajib milik sendiri, ownerId ikut pet baru
            if (updateAppointmentDto.petId !== undefined) {
                const pet = await this.appointmentValidator.validatePetExist(updateAppointmentDto.petId)
                
                await this.appointmentValidator.validateOwnerAccess(
                    currentUser.id,
                    existing.ownerId
                )

                data.petId = updateAppointmentDto.petId;
                data.ownerId = pet.id
            }
            if (updateAppointmentDto.serviceType !== undefined) data.serviceType = updateAppointmentDto.serviceType;
            if (updateAppointmentDto.appointmentDate !== undefined) data.appointmentDate = new Date (updateAppointmentDto.appointmentDate);
            if (updateAppointmentDto.appointmentTime !== undefined) data.appointmentTime = updateAppointmentDto.appointmentTime;
            if (updateAppointmentDto.complaint !== undefined) data.complaint = updateAppointmentDto.complaint;
        } 
        else if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN) {
            // ADMIN OR SUPER ADMIN boleh isi semua feild
            if (updateAppointmentDto.petId !== undefined) {
                const pet = await this.appointmentValidator.validatePetExist(updateAppointmentDto.petId)
                data.petId = updateAppointmentDto.petId;
                data.ownerId = pet.ownerId;
            }
            if (updateAppointmentDto.doctorId !== undefined) {
                await this.appointmentValidator.validateDoctorExist(updateAppointmentDto.doctorId)
                data.doctorId = updateAppointmentDto.doctorId;
            }

            if (updateAppointmentDto.serviceType !== undefined) data.serviceType = updateAppointmentDto.serviceType;
            if (updateAppointmentDto.appointmentStatus !== undefined) data.status = updateAppointmentDto.appointmentStatus;

            if (updateAppointmentDto.serviceType !== ServiceType.HOME_VISIT) {

            }

            if (updateAppointmentDto.transportFee !== undefined) {
                if (updateAppointmentDto.serviceType !== ServiceType.HOME_VISIT) {
                    throw new BadRequestException('You have to change service type into HOME CLINIC before input Transport Fee')
                } else {
                    data.transportFee = updateAppointmentDto.transportFee;
                    // transportFee jadi nominal invoice DP (buat kalau belum ada).
                    await this.invoiceHelper.handleTransportInvoice(appointmentId, updateAppointmentDto, existing)
                }
            }
            if (updateAppointmentDto.appointmentDate !== undefined) data.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
            if (updateAppointmentDto.appointmentTime !== undefined) data.appointmentTime = updateAppointmentDto.appointmentTime;
            if (updateAppointmentDto.complaint !== undefined) data.complaint = updateAppointmentDto.complaint;

            // invoiceStatus: update invoice DP milik appointment ini
            if (updateAppointmentDto.invoiceStatus !== undefined) {
                const invoice = await this.appointmentValidator.validateInvoiceExists(appointmentId)
                await this.prismaService.invoice.update({
                    where : { id: invoice.id },
                    data : { status: updateAppointmentDto.invoiceStatus },
                });
            }
        } else {
            throw new ForbiddenException('You are not allowed to update an appointment')
        }

        // 3. Simpan perubahan
        const updated = await this.prismaService.appointment.update({
            where: { id: appointmentId },
            data,
            select: {
                id: true,
                appointmentCode: true,
                petId: true,
                ownerId: true,
                doctorId: true,
                serviceType: true,
                transportFee: true,
                status: true,
                appointmentDate: true,
                appointmentTime: true,
                complaint: true,
            }
        })

        return {
            status: 200,
            message: 'Appointment updated successfully',
            data: {
                ...updated,
                transportfee: updated.transportFee ? updated.transportFee.toNumber() : null,
                appointmentDate: updated.appointmentDate instanceof Date ? updated.appointmentDate.toISOString().split('T')[0] : String(updated.appointmentDate)
            }
        }
    }

    async cancelAppointment(currentUser: ActiveUserData, appointmentId: number, dto?: CancelAppointmentDto) {
        const appointment = await this.appointmentValidator.validateCancelableAppointment(appointmentId)

        // OWNER hanya milik sendiri, ADMIN bebas.
        if (currentUser.role === Role.OWNER) {
            const petOwner = await this.prismaService.petOwner.findUnique({
                where: { userId: currentUser.id },
            });
            if (!petOwner || appointment.ownerId !== petOwner.id) {
                throw new ForbiddenException('You can only cancel your own appointment');
            }
        } else if (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
            await this.appointmentValidator.validateCancelPermission(currentUser.role)
        }

        // Appointment cancel + invoice UNPAID ikut cancel. Yang PAID tetap (refund manual).
        await this.prismaService.$transaction([
            this.prismaService.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: AppointmentStatus.CANCELLED,
                    cancelReason: dto?.cancelReason ?? null,
                },
            }),
            this.prismaService.invoice.updateMany({
                where: { appointmentId, status: InvoiceStatus.UNPAID },
                data: { status: InvoiceStatus.CANCELLED },
            }),
        ]);

        return {
            status: 200,
            message: 'Appointment cancelled successfully',
            data: { id: appointment.id, appointmentCode: appointment.appointmentCode },
        };
    }

    async findAllAppointment(paginationDto: PaginationDto): Promise<PaginatedAppointmentsResponseDto> {
        const pageNum = Number(paginationDto.page ?? 1)
        const limitNum = Number(paginationDto.page ?? 1)
        const skip = (pageNum - 1) * limitNum

        const where =  buildWhereCondition(paginationDto);

        const [appointments, totalData] = await Promise.all([
            this.prismaService.appointment.findMany({
                where,
                skip: skip,
                take: limitNum,
                select: appointmentSelect,
                orderBy: { id: 'asc' },
            }),
            this.prismaService.appointment.count({ where }),
        ])

        return {
            status: 200,
            message: 'Success',
            data: appointments.map((a) => formatAppointment(a)),
            meta: {
                page: pageNum,
                limit: limitNum,
                totalData: totalData,
                totalPages: Math.ceil(totalData / limitNum),
            },
        }
    }

    async getAppointmentById (@Param('id', ParseIntPipe) AppointmentId: number) {
        const appointment = await this.prismaService.appointment.findUnique({
            where: { id : AppointmentId },
            select: appointmentSelect
        })

        if (!appointment) {
            return null
        }

        return {
            status: 200,
            message: 'Success',
            data: appointment
        }
    }
}
