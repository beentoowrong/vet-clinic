import { ApiProperty } from "@nestjs/swagger";
import { Role } from "generated/prisma/enums";

export class UserSuccessResponse {
    @ApiProperty({ example: 1 })
    id! : number;
    
    @ApiProperty({ example: 'John Doe' })
    name!: string;

    @ApiProperty({ example: 'johndoe@gmail.com' })
    email!: string;

    @ApiProperty({ enum: Role, example: Role.DOCTOR })
    role!: Role;

    @ApiProperty({ example: '2026-07-23T10:00:00.000Z'})
    createdBy!: string;
}