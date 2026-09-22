import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'supersecretpassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: '081212121212' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ enum: Role, example: Role.DOCTOR })
  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;

  // Doctor fields (wajib kalau role = DOCTOR)
  @ApiProperty({ example: 'SIP-VET/2026/001', required: false })
  @IsString()
  @IsOptional()
  sipNumber?: string;

  @ApiProperty({ example: 'Bedah Hewan', required: false })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty({ example: 'Senin - Jumat', required: false })
  @IsString()
  @IsOptional()
  practiceDays?: string;

  @ApiProperty({ example: '08:00', required: false })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ example: '16:00', required: false })
  @IsString()
  @IsOptional()
  endTime?: string;
}
