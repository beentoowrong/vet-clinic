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

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly prismaService : PrismaService
    ) {}
    
    async createAppointment(currentUser: ActiveUserData, createAppointmentDto : CreateAppointmentDto): Promise<CreateAppointmentResponseDto> {
        // Step 1. Cari pet, 404 kalau tidak ada. ownerId diambil dari pet.
        const pet = await this.prismaService.pet.findUnique({
            where: { id: createAppointmentDto.petId },
            select: { id: true, ownerId: true },
        });

        if (!pet) {
            throw new NotFoundException(`Pet with ID ${createAppointmentDto.petId} not found`);
        }
        const targetOwnerId = pet.ownerId;

        // Step 2. Branching berdasarkan role untuk doctorId.
        let targetDoctorId: number | null = null;

        if (currentUser.role === Role.OWNER) {
            // OWNER: hanya pet sendiri. doctorId dari body diabaikan,
            // dokter di-assign admin belakangan.
            const petOwner = await this.prismaService.petOwner.findUnique({
                where: { userId: currentUser.id },
            });

            if (!petOwner || pet.ownerId !== petOwner.id) {
                throw new ForbiddenException('You can only create an appointment for your own pet');
            }
            targetDoctorId = null;
        } else if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN) {
            // ADMIN: semua pet boleh, tapi doctorId wajib (400 kalau kosong).
            if (!createAppointmentDto.doctorId) {
                throw new BadRequestException('doctorId is required when created by Admin');
            }

            const doctor = await this.prismaService.doctor.findUnique({
                where: { id: createAppointmentDto.doctorId },
            });

            if (!doctor) {
                throw new NotFoundException(`Doctor with ID ${createAppointmentDto.doctorId} not found`);
            }
            targetDoctorId = createAppointmentDto.doctorId;
        } else {
            throw new ForbiddenException('You are not allowed to create an appointment');
        }

        // Step 3. Generate kode unik appointment.
        const randomCode = Math.floor(10000000 + Math.random() * 90000000)
        const appointmentCode = `APPT-${randomCode}` 


        // Step 4. Simpan ke database.
        const newAppointment = await this.prismaService.appointment.create({
            data: {
                appointmentCode: appointmentCode,
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
        let invoice: { id: number; invoiceNumber: string; totalAmount: number; status: InvoiceStatus; paymentDueDate: Date } | null = null;
        if (createAppointmentDto.serviceType === ServiceType.HOME_VISIT) {
            const newInvoice = await this.prismaService.invoice.create({
                data: {
                    invoiceNumber: `INV-${Math.floor(10000000 + Math.random() * 90000000)}`,
                    appointmentId: newAppointment.id,
                    type: InvoiceType.DP_TRANSPORT,
                    description: 'DP biaya transport home visit',
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
        const existing = await this.prismaService.appointment.findUnique({
            where: { id: appointmentId },
            select: { id: true, ownerId: true, serviceType: true, appointmentDate: true },
        });

        if (!existing) {
            throw new NotFoundException({
                status: 404,
                message: `Appointment with ID ${appointmentId} not found`,
                data: null
            })
        }

        const data : any = {};

        if(currentUser.role === Role.OWNER) {
            if (
                updateAppointmentDto.doctorId !== undefined || 
                updateAppointmentDto.appointmentStatus !== undefined || 
                updateAppointmentDto.invoiceStatus !== undefined ||
                updateAppointmentDto.transportFee !== undefined
            ) {
                throw new ForbiddenException('This field can only be updated by admin');
            }
            const petOwner = await this.prismaService.petOwner.findUnique({
                where: { userId: currentUser.id },
            })
            if (!petOwner || existing.ownerId !== petOwner.id) {
                throw new ForbiddenException('You can only update your own appointment');
            }

            // Owner: ganti petId wajib milik sendiri, ownerId ikut pet baru
            if (updateAppointmentDto.petId !== undefined) {
                const pet = await this.prismaService.pet.findUnique({
                    where: { id: updateAppointmentDto.petId },
                    select: { ownerId: true },
                });
                if (!pet) {
                    throw new NotFoundException(`Pet with ID ${updateAppointmentDto.petId} not found`)
                } 
                if (pet.ownerId !== petOwner.id) {
                    throw new ForbiddenException('You can only use your own pet');
                }
                data.petId = updateAppointmentDto.petId;
                data.ownerId = petOwner.id
            }
            if (updateAppointmentDto.serviceType !== undefined) data.serviceType = updateAppointmentDto.serviceType;
            if (updateAppointmentDto.appointmentDate !== undefined) data.appointmentDate = new Date (updateAppointmentDto.appointmentDate);
            if (updateAppointmentDto.appointmentTime !== undefined) data.appointmentTime = updateAppointmentDto.appointmentTime;
            if (updateAppointmentDto.complaint !== undefined) data.complaint = updateAppointmentDto.complaint;
        } else if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN) {
            // ADMIN OR SUPER ADMIN boleh isi semua feild
            if (updateAppointmentDto.petId !== undefined) {
                const pet = await this.prismaService.pet.findUnique({
                    where: { id: updateAppointmentDto.petId },
                    select: { ownerId: true }
                });
                if (!pet) {
                    throw new NotFoundException(`Pet with ID ${updateAppointmentDto.petId} not found`);
                }
                data.petId = updateAppointmentDto.petId;
                data.ownerId = pet.ownerId;
            }
            if (updateAppointmentDto.doctorId !== undefined) {
                const doctor = await this.prismaService.doctor.findUnique({
                    where: { id: updateAppointmentDto.doctorId },
                });
                if (!doctor) {
                    throw new NotFoundException(`Doctor with ID ${updateAppointmentDto.doctorId} not found`);
                }
                data.doctorId = updateAppointmentDto.doctorId;
            }
            if (updateAppointmentDto.serviceType !== undefined) data.serviceType = updateAppointmentDto.serviceType;
            if (updateAppointmentDto.appointmentStatus !== undefined) data.status = updateAppointmentDto.appointmentStatus;
            if (updateAppointmentDto.transportFee !== undefined) {
                data.transportFee = updateAppointmentDto.transportFee;
                // transportFee jadi nominal invoice DP (buat kalau belum ada).
                const effectiveType = updateAppointmentDto.serviceType ?? existing.serviceType;
                if (effectiveType === ServiceType.HOME_VISIT) {
                    const dueDate = updateAppointmentDto.appointmentDate
                        ? new Date(updateAppointmentDto.appointmentDate)
                        : existing.appointmentDate;
                    const dpInvoice = await this.prismaService.invoice.findFirst({
                        where: { appointmentId, type: InvoiceType.DP_TRANSPORT },
                    });
                    if (dpInvoice) {
                        await this.prismaService.invoice.update({
                            where: { id: dpInvoice.id },
                            data: { totalAmount: updateAppointmentDto.transportFee },
                        });
                    } else {
                        await this.prismaService.invoice.create({
                            data: {
                                invoiceNumber: `INV-${Math.floor(10000000 + Math.random() * 90000000)}`,
                                appointmentId,
                                type: InvoiceType.DP_TRANSPORT,
                                description: 'DP biaya transport home visit',
                                totalAmount: updateAppointmentDto.transportFee,
                                paymentDueDate: dueDate,
                            },
                        });
                    }
                }
            }
            if (updateAppointmentDto.appointmentDate !== undefined) data.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
            if (updateAppointmentDto.appointmentTime !== undefined) data.appointmentTime = updateAppointmentDto.appointmentTime;
            if (updateAppointmentDto.complaint !== undefined) data.complaint = updateAppointmentDto.complaint;

            // invoiceStatus: update invoice DP milik appointment ini
            if (updateAppointmentDto.invoiceStatus !== undefined) {
                const invoice = await this.prismaService.invoice.findFirst({
                    where: { appointmentId, type: InvoiceType.DP_TRANSPORT },
                });
                if (!invoice) {
                    throw new BadRequestException('This appointment has no invoice yet');
                }
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
        const existing = await this.prismaService.appointment.findUnique({
            where: { id: appointmentId },
            select: { id: true, ownerId: true, status: true, appointmentCode: true },
        });

        if (!existing) {
            throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
        }
        if (existing.status === AppointmentStatus.COMPLETED) {
            throw new BadRequestException('Completed appointment cannot be cancelled');
        }
        if (existing.status === AppointmentStatus.CANCELLED) {
            throw new BadRequestException('Appointment is already cancelled');
        }

        // OWNER hanya milik sendiri, ADMIN bebas.
        if (currentUser.role === Role.OWNER) {
            const petOwner = await this.prismaService.petOwner.findUnique({
                where: { userId: currentUser.id },
            });
            if (!petOwner || existing.ownerId !== petOwner.id) {
                throw new ForbiddenException('You can only cancel your own appointment');
            }
        } else if (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You are not allowed to cancel an appointment');
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
            data: { id: existing.id, appointmentCode: existing.appointmentCode },
        };
    }

    async findAllAppointment(paginationDto: PaginationDto): Promise<PaginatedAppointmentsResponseDto> {
        const { page = 1, limit = 10, search, id, appointmentCode, serviceType, status } = paginationDto

        const pageNum = Number(page)
        const limitNum = Number(limit)
        const skip = (pageNum - 1) * limitNum

        const whereCondition: any = {};

        if (search) {
            whereCondition.OR = [
                { appointmentCode: { contains: search, mode: 'insensitive' } },
                { pet: { name: { contains: search, mode: 'insensitive' } } },
                { owner: { user: { name: { contains: search, mode: 'insensitive' } } } },
            ];
        }
        if (id) {
            whereCondition.id = id
        }
        if (appointmentCode) {
            whereCondition.appointmentCode = appointmentCode
        }
        if (serviceType) {
            whereCondition.serviceType = serviceType
        }
        if (status) {
            whereCondition.status = status
        }

        const [appointments, totalData] = await Promise.all([
            this.prismaService.appointment.findMany({
                where: whereCondition,
                skip: skip,
                take: limitNum,
                select: {
                    id: true,
                    appointmentCode: true,
                    pet: { select: { id: true, name: true } },
                    owner: {
                        select: {
                            id: true,
                            user: { select: { id: true, name: true } },
                        },
                    },
                    doctor: {
                        select: {
                            id: true,
                            specialization: true,
                            user: { select: { id: true, name: true } },
                        },
                    },
                    serviceType: true,
                    status: true,
                    appointmentDate: true,
                    appointmentTime: true,
                    complaint: true,
                    transportFee: true,
                    invoices: {
                        select: {
                            id: true,
                            invoiceNumber: true,
                            type: true,
                            totalAmount: true,
                            status: true,
                        },
                    },
                },
                orderBy: { id: 'asc' },
            }),
            this.prismaService.appointment.count({ where: whereCondition }),
        ])

        return {
            status: 200,
            message: 'Success',
            data: appointments.map((a) => ({
                ...a,
                complaint: a.complaint ?? '',
                transportFee: a.transportFee ? a.transportFee.toNumber() : null,
                appointmentDate: a.appointmentDate instanceof Date
                    ? a.appointmentDate.toISOString().split('T')[0]
                    : String(a.appointmentDate),
                invoices: a.invoices.map((inv) => ({
                    ...inv,
                    totalAmount: inv.totalAmount.toNumber(),
                })),
            })),
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
            select: {
                id: true,
                appointmentCode: true,
                pet: { select: { id: true, name: true } },
                owner: {
                    select: {
                        id: true,
                        user: { select: { id: true, name: true } },
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        specialization: true,
                        user: { select: { id: true, name: true } },
                    },
                },
                serviceType: true,
                status: true,
                appointmentDate: true,
                appointmentTime: true,
                complaint: true,
                transportFee: true,
                invoices: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        type: true,
                        totalAmount: true,
                        status: true,
                    },
                },
            },
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
