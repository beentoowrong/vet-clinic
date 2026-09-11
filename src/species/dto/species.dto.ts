import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SpeciesDto {
  @ApiProperty({ example: 'Reptile' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
