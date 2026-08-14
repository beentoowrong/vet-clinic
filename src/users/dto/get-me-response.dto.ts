import { ApiProperty, ApiPropertyOptional, getSchemaPath } from "@nestjs/swagger";
import { Role } from "generated/prisma/enums";


// DTO Profil Dokter
export class DoctorProfileDto {
    @ApiProperty({ example: 1 })
    doctorId!: number;

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
}

// DTO profil Owner / Pet Owner
export class PetOwnerProfileDto {
    @ApiProperty({ example: 1 })
    petOwnerId!: number;

    @ApiProperty({ example: 'Jl. Margonda Raya No. 123, Depok' })
    address?: string;
}

// Main DTO for Response User Data
export class GetMeResponseDataDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'John Doe'})
    name!: string;

    @ApiProperty({ example: 'johndoe@example.com' })
    email!: string;

    @ApiProperty({ example: '081212121212' })
    phoneNumber!: string;

    @ApiProperty({ enum: Role, example: Role.OWNER })
    role!: Role;

    // Menggunakan oneOf agar swagger menampilkan opsi schema DOCTOR atau OWNER
    @ApiPropertyOptional({
        description: 'Detail profile for specific role (DOCTOR and OWNER)',
        oneOf: [
            { $ref: getSchemaPath(DoctorProfileDto) },
            { $ref: getSchemaPath(PetOwnerProfileDto) },
        ],
    })
    profile?: DoctorProfileDto | PetOwnerProfileDto; 
}

export class GetMeResponseDto {
    @ApiProperty({ example: 200 })
    status!: number;

    @ApiProperty({ example: 'Success' })
    message!: string;

    @ApiProperty({ type: GetMeResponseDataDto })
    data!: GetMeResponseDataDto;
}