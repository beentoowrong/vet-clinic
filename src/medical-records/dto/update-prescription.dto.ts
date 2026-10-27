import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePrescriptionDto {
    @ApiProperty({ example: 'Ondansetron Syrup 4mg' })
    @IsString()
    @IsOptional()
    medicineName?: string;

    @ApiProperty({ example: '0.5 ml' })
    @IsString()
    @IsOptional()
    dosage?: string;

    @ApiProperty({ example: '2x sehari sesudah makan' })
    @IsString()
    @IsOptional()
    frequency?: string;

    @ApiProperty({ example: '5 hari' })
    @IsString()
    @IsOptional()
    duration?: string;

    @ApiProperty({ example: 'Hentikan jika muntah berhenti', required: false })
    @IsString()
    @IsOptional()
    notes?: string | null;
}