import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PrescriptionDto } from './prescription.dto';

export class UpdateMedicalRecordDto {
    @ApiProperty({ example: 4.2, required: false })
    @IsNumber()
    @IsOptional()
    weightKg?: number;

    @ApiProperty({ example: 38.5, required: false })
    @IsNumber()
    @IsOptional()
    temperatureCelcius?: number;

    @ApiProperty({ example: 'Muntah 3x sejak pagi, lemas, nafsu makan turun', required: false })
    @IsString()
    @IsOptional()
    symptoms?: string;

    @ApiProperty({ example: 'Gastritis Akut akibat infeksi pencernaan ringan', required: false })
    @IsString()
    @IsOptional()
    diagnosis?: string;

    @ApiProperty({ example: 'Injeksi antiemetik dan pemberian vitamin', required: false })
    @IsString()
    @IsOptional()
    treatment?: string;

    @ApiProperty({ example: 'Kontrol ulang 3 hari lagi', required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ example: '2026-08-08', required: false })
    @IsString()
    @IsOptional()
    followUpDate?: string;

    // Kalau dikirim, SELURUH resep lama diganti dengan array ini.
    // Kirim [] untuk hapus semua resep.
    @ApiProperty({ type: [PrescriptionDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PrescriptionDto)
    @IsOptional()
    prescription?: PrescriptionDto[] | null;
}