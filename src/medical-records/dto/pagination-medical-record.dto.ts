import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class MedicalRecordPaginationDto {
    @ApiProperty({ description: 'Page number (1-based)', example: 1, minimum: 1, default: 1, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;
    
    @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1, default: 10, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @ApiProperty({ description: 'Search by Medical Record Code', example: 'MR-20261008-Ty764V3CwD', required: false })
    @IsOptional()
    @IsString()
    searchMedicalRecordCode?: string;

    @ApiProperty({
        description: 'Filter by Pet ID',
        example: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    petId?: number;

    @ApiProperty({
        description: 'Filter by Appointment ID',
        example: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    appointmentId?: number;
}