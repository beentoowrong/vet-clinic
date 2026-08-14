import { ApiProperty } from "@nestjs/swagger";
import { Role } from "generated/prisma/enums"


export class UserDataDto {
    @ApiProperty({ example: 3 })
    id!: number;

    @ApiProperty({ example: 'John Doe' })
    name!: string; 

    @ApiProperty({ example: 'johndoe@example.com' })
    email!: string;
    
    @ApiProperty({ example: '0812121212121' })
    phoneNumber?: string | null;
    
    @ApiProperty({ enum: Role, example: Role.DOCTOR })
    role!: Role;
}

