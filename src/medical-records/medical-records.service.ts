import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto /create-medical-record.dto';
import { CreateMedicalRecordResponseDto } from './dto /create-medical-record-response.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { Role, InvoiceType, AppointmentStatus } from 'generated/prisma/client';
import { CodeGenerator } from 'src/common/utils/code.generator';


@Injectable()
export class MedicalRecordsService {
    constructor (
        private readonly prismaService : PrismaService,
        private readonly codeGenerator: CodeGenerator,

    ) {}

    async createMedicalRecord( currentUser : ActiveUserData, createMedicalRecordDto: CreateMedicalRecordDto, appointmentId: number): Promise<CreateMedicalRecordResponseDto> {
        // Cek apakah yang akses role nya adalah dokter 
        if (currentUser.role !== Role.DOCTOR) {
            throw new ForbiddenException('You are not allowed to create Medical Record')
        }

        const existing = await this.prismaService.appointment.findUnique({
            where : { id:  appointmentId },
            select : { id: true, petId: true, ownerId: true, doctorId: true }
        })

        if (!existing) {
            throw new NotFoundException(`Appointment with ID ${appointmentId} not found`)
        }

        const me = await this.prismaService.doctor.findUnique({
            where: { userId : currentUser.id },
            select: { id: true }
        })
        if (!me) throw new ForbiddenException('Doctor profile not found')
        if (!existing.doctorId) throw new BadRequestException('Please assign doctor first')
        if (existing.doctorId !== me.id) throw new ForbiddenException(`Only the assigned doctor with id ${me.id}`)

        const duplicate = await this.prismaService.medicalRecord.findUnique({
            where: { appointmentId },
            select: { id: true },
        });
        if (duplicate) {
            throw new ConflictException(`Medical record for appointment ID ${appointmentId} already exists, update it instead`);
        }

        const medicalRecordCode = await this.codeGenerator.generateUniqueMedicalRecordCode('MR')
        const invoiceCode = await this.codeGenerator.generateUniqueCode('INV')

        const result = await this.prismaService.$transaction([
            this.prismaService.medicalRecord.create({
                data :{
                    appointmentId: existing.id,
                    petId: existing.petId,
                    doctorId: existing.doctorId,
                    recordCode: medicalRecordCode,
                    weightKg: createMedicalRecordDto.weightKg,
                    temperatureCelcius: createMedicalRecordDto.temperatureCelcius,
                    symptoms: createMedicalRecordDto.symptoms,
                    diagnosis: createMedicalRecordDto.diagnosis,
                    treatment: createMedicalRecordDto.treatment,
                    notes: createMedicalRecordDto.notes,
                    followUpDate: createMedicalRecordDto.followUpDate
                    ? new Date(createMedicalRecordDto.followUpDate)
                    : null,
                    prescriptions: { create: createMedicalRecordDto.prescription ?? [] },
                },
                include: { prescriptions: true },
            }),
            this.prismaService.appointment.update({ 
                where : { id: appointmentId },
                data: { status: AppointmentStatus.COMPLETED }
            }),
            this.prismaService.invoice.create({
                data: {
                    invoiceNumber: invoiceCode,
                    appointmentId: existing.id,
                    type: InvoiceType.TREATMENT,
                    description: createMedicalRecordDto.diagnosis,
                    totalAmount: 0,
                    paymentDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                }
            })
        ])

        const [medicalRecord] = result; // ambil elemen 1, sisanya efek samping

        return {
            status: 201,
            message: 'Medical Record Successfuly Created',
            data: {
                id: medicalRecord.id,
                petId: medicalRecord.petId,
                recordCode: medicalRecord.recordCode,
                appointmentId: medicalRecord.appointmentId,
                doctorId: medicalRecord.doctorId,
                weightKg: medicalRecord.weightKg,
                temperatureCelcius: medicalRecord.temperatureCelcius,
                symptoms: medicalRecord.symptoms,
                diagnosis: medicalRecord.diagnosis,
                treatment: medicalRecord.treatment,
                notes: medicalRecord.notes ?? undefined,
                followUpDate: medicalRecord.followUpDate
                    ? medicalRecord.followUpDate.toISOString().split('T')[0]
                    : undefined,
                prescriptions: medicalRecord.prescriptions.map((p) => ({
                    id: p.id,
                    medicineName: p.medicineName,
                    dosage: p.dosage,
                    frequency: p.frequency,
                    duration: p.duration,
                    notes: p.notes ?? undefined,
                })),
            },
        };
    }
}