import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'generated/prisma/enums';

export class OwnerUserDto {
  @ApiProperty({ example: 'Budi' })
  name!: string;
}

export class OwnerSummaryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ type: () => OwnerUserDto })
  user!: OwnerUserDto;
}

export class SpeciesSummaryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Kucing' })
  name!: string;
}

export class BreedSummaryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Persia' })
  name!: string;
}

export class PetDataItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Pororo' })
  name!: string;

  @ApiProperty({ type: () => OwnerSummaryDto })
  owner!: OwnerSummaryDto;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  gender!: Gender;

  @ApiProperty({ type: () => SpeciesSummaryDto })
  species!: SpeciesSummaryDto;

  @ApiProperty({ type: () => BreedSummaryDto })
  breed!: BreedSummaryDto;

  @ApiProperty({ example: 3 })
  age!: number;

  @ApiProperty({ example: 4.5, required: false })
  weightKg?: number | null;

  @ApiProperty({ example: 'White color', required: false })
  specialMarks?: string | null;

  @ApiProperty({ example: true })
  isSterilized!: boolean;

  @ApiProperty({ example: 1 })
  createdBy!: number;

  @ApiProperty({ example: '2026-09-01T00:00:00.000Z' })
  createdAt!: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 25 })
  totalData!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;
}

export class PaginatedPetsResponseDto {
  @ApiProperty({ example: 200 })
  status!: number;

  @ApiProperty({ example: 'Success' })
  message!: string;

  @ApiProperty({ type: () => [PetDataItemDto] })
  data!: PetDataItemDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
