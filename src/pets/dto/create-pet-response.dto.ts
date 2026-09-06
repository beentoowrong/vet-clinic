import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'generated/prisma/enums';

export class PetDataDto {
  @ApiProperty({ example: 'Pororo' })
  name!: string;

  @ApiProperty({ example: 1 })
  speciesId!: number;

  @ApiProperty({ example: 1 })
  breedId?: number;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  gender!: Gender;

  @ApiProperty({ example: 1 })
  age!: number;

  @ApiProperty({ example: 4.2, required: false })
  weightKg?: number | null;

  @ApiProperty({ example: 'White color and blue eyes', required: false })
  specialMarks?: string | null;

  @ApiProperty({ type: Boolean, example: true })
  isSterilized!: boolean;

  @ApiProperty({ example: 1 })
  createdBy?: number;
}

export class CreatePetResponseDto {
  status!: number;
  message!: string;
  data!: PetDataDto;
}
