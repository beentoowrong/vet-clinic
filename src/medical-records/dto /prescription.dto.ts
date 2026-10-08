import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PrescriptionDto {
    @ApiProperty({ example: 'Ondansetron Syrup 4mg' })
    @IsString()
    @IsNotEmpty()
    medicineName!: string;

    @ApiProperty({ example: '0.5 ml' })
    @IsString()
    @IsNotEmpty()
    dosage!: string;

    @ApiProperty({ example: '2x sehari sesudah makan' })
    @IsString()
    @IsNotEmpty()
    frequency!: string;

    @ApiProperty({ example: '5 hari' })
    @IsString()
    @IsNotEmpty()
    duration!: string;

    @ApiProperty({ example: 'Hentikan jika muntah berhenti', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}