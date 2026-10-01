import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class DoctorPaginationDto {
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

  @ApiProperty({ description: 'Search by doctor name or specialization', example: 'Bedah', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by specialization', example: 'Bedah Hewan', required: false })
  @IsOptional()
  @IsString()
  specialization?: string;
}
