import { ApiProperty } from "@nestjs/swagger";
import { AppointmentStatus, ServiceType } from "generated/prisma/enums";


export class DataAppointmentResponseDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'APPT-23567812' })
    appointmentCode!: string;
    
    @ApiProperty({ example: 1 })
    petId!: number;
    
    @ApiProperty({ example: 1 })
    ownerId!: number;

    @ApiProperty({ example: 1 })
    doctorId!: number;
    
    @ApiProperty({ enum: ServiceType, example: ServiceType.IN_CLINIC })
    serviceType!: ServiceType;

    @ApiProperty({ example: 320000 })
    transportFee?: number | null;

    @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.CONFIRMED })
    status!: AppointmentStatus;

    @ApiProperty({ example: '2026-08-05' })
    appointmentDate!: string;

    @ApiProperty({ example: '14:00' })
    appointmentTime!: string;

    @ApiProperty({ example: 'Anjing lemas tidak mau bangun' })
    complaint!: string;
}

export class CreateAppointmentResponseDto {
    status!: 201;
    messages!: 'Succesfully created appointment';
    data!: DataAppointmentResponseDto;
}