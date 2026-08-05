import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
    @ApiProperty({ description: 'The full name of the user', example : 'John Doe' })
    @IsString()
    @IsNotEmpty({ message:'The name field can not be empty' })
    name! : string;

    @ApiProperty({ description: 'Active email use for login', example: 'johndoe@example.com' })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'The email field can not be empty' })
    email! : string;

    @ApiProperty({ description: 'Minimum password has 8 characther', example: 'fullofsecret123', minLength: 8})
    @IsString()
    @MinLength(8, { message: 'Mininum password has 8 characther' })
    @IsNotEmpty({ message: 'The password field can not be empty' })
    password! : string;

    @ApiProperty({ description: 'Active phone number', example: '08123456789' })
    @IsString()
    phoneNumber! : string

    @ApiProperty({ description: 'Address of pet owner',  example: 'Jl. Kebayoran Lama', })
    @IsString()
    address! : string
}
