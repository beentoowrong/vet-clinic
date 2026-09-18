import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsEnum, IsDecimal, IsString } from "class-validator"
import { AppointmentStatus, InvoiceStatus, ServiceType } from "generated/prisma/enums"

export class UpdateAppointment { 
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    petId? : number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    ownerId? : number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    doctorId? : number;

    @ApiProperty({ enum: ServiceType, example: ServiceType.HOME_VISIT })
    @IsEnum(ServiceType)
    @IsOptional()
    serviceType? : ServiceType;

    @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.CONFIRMED })
    @IsEnum(AppointmentStatus)
    @IsOptional()
    appointmentStatus? : AppointmentStatus;

    @ApiProperty({ enum: InvoiceStatus, example: InvoiceStatus.PAID })
    @IsEnum(InvoiceStatus)
    @IsOptional()
    invoiceStatus? : InvoiceStatus;

    @ApiProperty({ example: 543.0000 })
    @IsDecimal()
    @IsOptional()
    transportFee? : number;


    @ApiProperty({ example: '2026-08-05' })
    @IsOptional()
    appointmentDate?: string;

    @ApiProperty({ example: '14:00' })
    @IsString()
    @IsOptional()
    appointmentTime?: string;

    @ApiProperty({ example: 'Anjing lemas tidak mau bangun' })
    @IsString()
    @IsOptional()
    complaint?: string;
}