import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ServiceType } from 'generated/prisma/enums';

export class CreateAppointmentDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    petId!: number;

    @ApiProperty({ example: 1, required: false, description: 'Required for Admin/Super Admin, ignored for Owner' })
    @IsNumber()
    @IsOptional()
    doctorId?: number;

    @ApiProperty({ enum: ServiceType, example: ServiceType.HOME_VISIT })
    @IsEnum(ServiceType)
    @IsNotEmpty()
    serviceType!: ServiceType;

    @ApiProperty({ example: '2026-08-05' })
    @IsNotEmpty()
    appointmentDate!: string;

    @ApiProperty({ example: '14:00' })
    @IsString()
    @IsNotEmpty()
    appointmentTime!: string;

    @ApiProperty({ example: 'Anjing lemas tidak mau bangun' })
    @IsString()
    @IsNotEmpty()
    complaint!: string;
}