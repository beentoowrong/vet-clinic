import { ApiProperty } from '@nestjs/swagger';

export class DoctorUserDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Dr. Sari' })
  name!: string;
}

export class DoctorDataItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'SIP-VET/2026/001' })
  sipNumber!: string;

  @ApiProperty({ example: 'Bedah Hewan' })
  specialization!: string;

  @ApiProperty({ example: 'Senin - Jumat' })
  practiceDays!: string;

  @ApiProperty({ example: '08:00' })
  startTime!: string;

  @ApiProperty({ example: '16:00' })
  endTime!: string;

  @ApiProperty({ type: () => DoctorUserDto })
  user!: DoctorUserDto;
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

export class PaginatedDoctorsResponseDto {
  @ApiProperty({ example: 200 })
  status!: number;

  @ApiProperty({ example: 'Success' })
  message!: string;

  @ApiProperty({ type: () => [DoctorDataItemDto] })
  data!: DoctorDataItemDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
