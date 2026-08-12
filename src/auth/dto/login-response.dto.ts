import { ApiProperty } from "@nestjs/swagger";
import { Role } from "generated/prisma/enums"


// 1. Sub-DTO khusus objek User
export class UserResponseBodyDto {
    @ApiProperty({ example: 1 })
    id! : number;
    
    @ApiProperty({ example: 'John Doe' })
    name!: string;

    @ApiProperty({ example: 'johndoe@gmail.com' })
    email!: string;

    @ApiProperty({ enum: Role, example: Role.DOCTOR })
    role!: Role;
}

// 2. DTO untuk isi field Data
export class LoginUserDataDto {
    @ApiProperty({
        description: 'JWT token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoiZHJhZ29zQGV4YW1wbGUuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzg1OTk4NjkzLCJleHAiOjE3ODYwODUwOTN9.K5WhoSvQgJARLFAqr8CQdo-oeSy-nkXr9FykC0EZAy4'
    })
    token!: string;

    @ApiProperty({ type: UserResponseBodyDto }) // <-- Menyebutkan sub-object user
    user!: UserResponseBodyDto;
}

// 3. DTO Utama Response
export class LoginResponseDto {
    @ApiProperty({ example: 200 })
    status!: number;

    @ApiProperty({ example: 'User login successfully' })
    message!: string;

    @ApiProperty({ type: LoginUserDataDto })
    data!: LoginUserDataDto;    
}