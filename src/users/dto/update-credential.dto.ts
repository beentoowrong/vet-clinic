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
}