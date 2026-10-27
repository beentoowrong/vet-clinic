import { ApiProperty } from "@nestjs/swagger";
import { MedicalRecordPrescriptionResponseDto } from "./create-medical-record-response.dto";

export class MedicalRecordUserDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'Dr. Sari' })
    name!: string;
}

export class MedicalRecordPetDto {
    @ApiProperty({ example: 12 })
    id!: number;

    @ApiProperty({ example: 'Pororo' })
    name!: string;
}

export class MedicalRecordDoctorDto {
    @ApiProperty({ example: 2 })
    id!: number;

    @ApiProperty({ example: 'Bedah Hewan' })
    specialization!: string;

    @ApiProperty({ type: () => MedicalRecordUserDto })
    user!: MedicalRecordUserDto;
}

export class MedicalRecordAppointmentDto {
    @ApiProperty({ example: 101 })
    id!: number;

    @ApiProperty({ example: 'APPT-33992096' })
    appointmentCode!: string;
}

export class MedicalRecordDataItemDto {
    @ApiProperty({ example: 501 })
    id!: number;

    @ApiProperty({ example: 'MR-20260805-012' })
    recordCode!: string;

    @ApiProperty({ type: () => MedicalRecordAppointmentDto })
    appointment!: MedicalRecordAppointmentDto;

    @ApiProperty({ type: () => MedicalRecordPetDto })
    pet!: MedicalRecordPetDto;

    @ApiProperty({ type: () => MedicalRecordDoctorDto })
    doctor!: MedicalRecordDoctorDto;

    @ApiProperty({ example: 4.2 })
    weightKg!: number;

    @ApiProperty({ example: 38.5 })
    temperatureCelcius!: number;

    @ApiProperty({ example: 'Muntah 3x sejak pagi, lemas, nafsu makan turun' })
    symptoms!: string;

    @ApiProperty({ example: 'Gastritis Akut akibat infeksi pencernaan ringan' })
    diagnosis!: string;

    @ApiProperty({ example: 'Injeksi antiemetik dan pemberian vitamin' })
    treatment!: string;

    @ApiProperty({ example: 'Kontrol ulang 3 hari lagi', required: false })
    notes?: string | null;

    @ApiProperty({ example: '2026-08-08', required: false })
    followUpDate?: string | null;

    @ApiProperty({ type: [MedicalRecordPrescriptionResponseDto] })
    prescriptions!: MedicalRecordPrescriptionResponseDto[];

    @ApiProperty({ example: '2026-08-05T11:15:00.000Z' })
    createdAt!: Date;
}

export class PaginationMetaDto {
    @ApiProperty({ example: 1 })
    page!: number;

    @ApiProperty({ example: 10 })
    limit!: number;

    @ApiProperty({ example: 25 })
    totalData!: number;

    @ApiProperty({ example: 3 })
    totalPages!: number;
}

export class PaginatedMedicalRecordsResponseDto {
    @ApiProperty({ example: 200 })
    status!: number;

    @ApiProperty({ example: 'Success' })
    message!: string;

    @ApiProperty({ type: () => [MedicalRecordDataItemDto] })
    data!: MedicalRecordDataItemDto[];

    @ApiProperty({ type: () => PaginationMetaDto })
    meta!: PaginationMetaDto;
}
