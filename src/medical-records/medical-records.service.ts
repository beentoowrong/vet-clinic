import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto /create-medical-record.dto';
import { MedicalRecordResponseDto } from './dto /create-medical-record-response.dto';
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

    async createMedicalRecord( currentUser : ActiveUserData, createMedicalRecordDto: CreateMedicalRecordDto, appointmentId: number): Promise<MedicalRecordResponseDto> {
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
        if (existing.doctorId !== me.id) throw new ForbiddenException(`Only the assigned doctor with id ${currentUser.id}`)

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
                }
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
                prescriptions: [],
            },
        };
    }
}