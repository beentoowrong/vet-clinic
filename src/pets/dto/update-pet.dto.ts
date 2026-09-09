import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'generated/prisma/enums';

export class UpdatePetDto {
      @ApiProperty({ example: 'Pororo' })
      @IsString()
      @IsOptional()
      name?: string;
    
      @ApiProperty({ example: 1 })
      @IsNumber()
      @IsOptional()
      speciesId?: number;
    
      @ApiProperty({ example: 1 })
      @IsNumber()
      @IsOptional()
      breedId?: number;
    
      @ApiProperty({ enum: Gender, example: Gender.MALE })
      @IsEnum(Gender)
      @IsOptional()
      gender?: Gender;
    
      @ApiProperty({ example: 1 })
      @IsNumber()
      @IsOptional()
      age?: number;
    
      @ApiProperty({ example: 4.2 })
      @IsNumber()
      @IsOptional()
      weightkg?: number;
    
      @ApiProperty({ example: 'White color and blue eyes' })
      @IsString()
      @IsOptional()
      specialMarks?: string;
    
      @ApiProperty({ type: Boolean, example: true })
      @IsOptional()
      @IsBoolean()
      isSterilized?: boolean;
    
}