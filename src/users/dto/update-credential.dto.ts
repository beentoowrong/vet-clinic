import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { Role } from 'generated/prisma/enums';


export class UpdateCredentialDto {

    @ApiProperty({ example: 'Jane Doe' })
    @IsString()
    @IsOptional()
    name? : string;

    @ApiProperty({ example: 'Janedoe@gmail.com' })
    @IsEmail()
    @IsOptional()
    email? : string;

    @ApiProperty({ example: '081212121212' })
    @IsString()
    @IsOptional()
    phoneNumber? : string

    @ApiProperty({ enum: Role, example: Role.DOCTOR })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

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