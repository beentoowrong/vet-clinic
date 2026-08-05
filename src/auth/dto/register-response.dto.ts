import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDataDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'John Doe' })
    name: string;
    
    @ApiProperty({ example: 'johndoe@example.com' })
    email: string;

    @ApiProperty({ example: '08123456789' })
    phoneNumber: string;

    @ApiProperty({ example: 'Jl. Kebayoran Lama' })
    address: string;

    @ApiProperty({ example: 'OWNER' })
    role: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    token: string;
}

export class RegisterResponseDto {
    @ApiProperty({ example: 201 })
    status: number;

    @ApiProperty({ example: 'User registered successfully' })
    message: string;

    @ApiProperty({ type: RegisterUserDataDto })
    data: RegisterUserDataDto;
}
}