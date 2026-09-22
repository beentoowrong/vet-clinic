import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  // Base fields (semua role)
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '081212121212' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Owner fields
  @ApiPropertyOptional({ example: 'Jl. Sejaya Sentosa' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '081212121212' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;
}
