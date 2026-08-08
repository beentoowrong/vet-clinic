import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Role } from "generated/prisma/enums"


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
    role!: Role
}