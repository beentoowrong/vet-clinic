import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "generated/prisma/enums";


export class PetDataItemDto {

    @ApiProperty({example: 1})
    id!: number;

    @ApiProperty({ example: 'Pororo' })
    name!: number;

    @ApiProperty({ example: 1 })
    speciesId!: number;

    @ApiProperty({ example: 'Cat' })
    speciesName!: string;

    @ApiProperty({ example: 1 })
    breedId!: number;

    @ApiProperty({ example: 'Persia' })
    breedName!: string;

    @ApiProperty({ enum: Gender, example: Gender.MALE })
    gender!: Gender;

    @ApiProperty({ example: 3 })
    age!: number;

    @ApiProperty({ example: 4.5, required: false })
    weightKg?: number | null;

    @ApiProperty({ example: 'White color', required: false })
    specialMarks?: string | null;

    @ApiProperty({ example: true })
    isSterilized!: boolean;

    @ApiProperty({ example: 1 })
    ownerId!: number;

    @ApiProperty({ example: 'Budi' })
    ownerName!: string;

    @ApiProperty({ example: 1 })
    createdBy!: number;

    @ApiProperty({ example: '2026-09-01T00:00:00.000Z' })
    createdAt!: Date
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

  @ApiProperty({ type: [PetDataItemDto] })
  data!: PetDataItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
