import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto /create-medical-record.dto';
import { MedicalRecordResponseDto } from './dto /create-medical-record-response.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { Role } from 'generated/prisma/client';
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
            throw new NotFoundException(`Appointment with ID ${createMedicalRecordDto.appointmentId} not found`)
        }

        const medicalRecordCode = await this.codeGenerator.generateUniqueMedicalRecordCode('MR')

        const newMedicalRecord = await this.prismaService.medicalRecord.create({
            data: {
                recordCode: medicalRecordCode,
                weightKg: createMedicalRecordDto.weightKg,
                temperatureCelcius: createMedicalRecordDto.temperatureCelcius,
                symptoms: createMedicalRecordDto.symptoms,
                diagnosis: createMedicalRecordDto.diagnosis,
                treatment: createMedicalRecordDto.treatment,
                notes: createMedicalRecordDto.notes,
                followUpDate: createMedicalRecordDto.followUpDate,
            }
        })
    }
}


    // appointmentId!: number;
    // recordCode!: string;
    // weightKg!: number;
    // temperatureCelcius!: number;
    // symptoms!: string;
    // diagnosis!: string;
    // treatment!: string;
    // notes?: string;
    // followUpDate?: string;