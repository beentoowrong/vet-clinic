import { ApiProperty } from "@nestjs/swagger";

export class PrescriptionResponseDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'Ondansetron Syrup 4mg' })
    medicineName!: string;

    @ApiProperty({ example: 'Ondansetron Syrup 4mg' })
    dosage!: string;

    @ApiProperty({ example: '2x sehari sesudah makan' })
    frequency!: string;

    @ApiProperty({ example: '5 hari' })
    duration!: string;
    
    @ApiProperty({ example: 'Hentikan jika muntah sudah berhenti' })
    notes?: string;
}

export class DataMedicalRecordResponseDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'MR-20261005-8hN7p4ut3y' })
    recordCode!: string;

    @ApiProperty({ example: 1 })
    appointmentId!: number;

    @ApiProperty({ example: 1 })
    petId!: number;

    @ApiProperty({ example: 1 })
    doctorId!: number;

    @ApiProperty({ example: 4.2})
    weightKg!: number;

    @ApiProperty({ example: 39.10})
    temperatureCelcius!: number;

    @ApiProperty({ example: 'Muntah 3x sejak pagi, lemas, nafsu makan turun' })
    symptoms!: string;

    @ApiProperty({ example: 'Gastritis Akut akibat infeksi pencernaan ringan' })
    diagnosis!: string;

    @ApiProperty({ example: 'Injeksi antiemetik (anti-muntah) dan pemberian vitamin' })
    treatment!: string;
    
    @ApiProperty({ example: 'Kontrol ulang 3 hari lagi jika gejala muntah tidak berkurang' })
    notes?: string;

    @ApiProperty({ example: '2026-08-05' })
    followUpDate?: string;

    @ApiProperty({ example: '2026-08-05' })
    createdAt? : string;

    @ApiProperty({ type: [PrescriptionResponseDto], required: false })
    prescriptions? : PrescriptionResponseDto[]
}

export class CreateMedicalRecordResponseDto {
    @ApiProperty({ example: 201 })
    status!: 201;

    @ApiProperty({ example: 'Medical Record Successfuly Created' })
    message!: "Medical Record Successfuly Created";

    @ApiProperty({ type: () => DataMedicalRecordResponseDto })
    data!: DataMedicalRecordResponseDto;
}
