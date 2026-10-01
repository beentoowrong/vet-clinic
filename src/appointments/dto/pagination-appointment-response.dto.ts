import { ApiProperty } from '@nestjs/swagger';
import { InvoiceType, InvoiceStatus, AppointmentStatus, ServiceType } from 'generated/prisma/enums'

export class AppointmentUserDto{
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'Budi' })
    name!: string;
}

export class AppointmentOwnerDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ type: () => AppointmentUserDto })
    user!: AppointmentUserDto;
}

export class AppointmentPetDto {
    @ApiProperty({ example: 12 })
    id!: number;

    @ApiProperty({ example: 'Pororo' })
    name!: string;
}

export class AppointmentDoctorDto {
    @ApiProperty({ example: 2 })
    id!: number;

    @ApiProperty({ example: 'Bedah Hewan' })
    specialization!: string;

    @ApiProperty({ type: () => AppointmentUserDto })
    user!: AppointmentUserDto;
}

export class AppointmentInvoiceDto {
    @ApiProperty({ example: 2 })
    id!: number;

    @ApiProperty({ example: 'INV-20260805-002' })
    invoiceNumber!: string;

    @ApiProperty({ enum: InvoiceType, example: InvoiceType.DP_TRANSPORT })
    type!: InvoiceType;

    @ApiProperty({ example: 50000 })
    totalAmount!: number;

    @ApiProperty({ enum: InvoiceStatus, example: InvoiceStatus.UNPAID })
    status!: InvoiceStatus;
}

export class AppointmentDataItemDto {
    @ApiProperty({ example: 102 })
    id!: number;

    @ApiProperty({ example: 'APPT-33992096' })
    appointmentCode!: string;

    @ApiProperty({ type: () => AppointmentPetDto })
    pet!: AppointmentPetDto;

    @ApiProperty({ type: () => AppointmentOwnerDto })
    owner!: AppointmentOwnerDto;

    @ApiProperty({ type: () => AppointmentDoctorDto, required: false })
    doctor?: AppointmentDoctorDto | null;

    @ApiProperty({ enum: ServiceType, example: ServiceType.HOME_VISIT })
    serviceType!: ServiceType;

    @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.WAITING_FOR_PAYMENT })
    status!: AppointmentStatus;

    @ApiProperty({ example: '2026-08-05' })
    appointmentDate!: string;

    @ApiProperty({ example: '14:00' })
    appointmentTime!: string;

    @ApiProperty({ example: 'Anjing lemas tidak mau bangun' })
    complaint!: string;

    @ApiProperty({ example: 50000, required: false })
    transportFee?: number | null;

    @ApiProperty({ type: () => [AppointmentInvoiceDto] })
    invoices!: AppointmentInvoiceDto[];
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

export class PaginatedAppointmentsResponseDto {
    @ApiProperty({ example: 200 })
    status!: number;

    @ApiProperty({ example: 'Success' })
    message!: string;

    @ApiProperty({ type: () => [AppointmentDataItemDto] })
    data!: AppointmentDataItemDto[];

    @ApiProperty({ type: () => PaginationMetaDto })
    meta!: PaginationMetaDto;
}
