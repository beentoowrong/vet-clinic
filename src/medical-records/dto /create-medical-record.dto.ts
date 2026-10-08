import { PrescriptionDto } from "./prescription.dto";
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMedicalRecordDto {
    @ApiProperty({ example: 4.2 })
    @IsNumber()
    @IsNotEmpty()
    weightKg!: number;

    @ApiProperty({ example: 38.5 })
    @IsNumber()
    @IsNotEmpty()
    temperatureCelcius!: number;

    @ApiProperty({ example: 'Muntah 3x sejak pagi, lemas, nafsu makan turun' })
    @IsString()
    @IsNotEmpty()
    symptoms!: string;

    @ApiProperty({ example: 'Gastritis Akut akibat infeksi pencernaan ringan' })
    @IsString()
    @IsNotEmpty()
    diagnosis!: string;

    @ApiProperty({ example: 'Injeksi antiemetik dan pemberian vitamin' })
    @IsString()
    @IsNotEmpty()
    treatment!: string;

    @ApiProperty({ example: 'Kontrol ulang 3 hari lagi', required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ example: '2026-08-08', required: false })
    @IsString()
    @IsOptional()
    followUpDate?: string;

    @ApiProperty({ type: [PrescriptionDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PrescriptionDto)
    @IsOptional()
    prescription?: PrescriptionDto[] | null;
}