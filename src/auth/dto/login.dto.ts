import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginUserDto {
    @ApiProperty({
        description: 'User email',
        example: 'johndoe@example.com',
    })

    @IsEmail({}, { message: 'Invalidate email format' })
    @IsNotEmpty({ message: 'Email field can not be empty' })
    email!: string;

    @ApiProperty({
        description: 'User password',
        example: 'supersecret123',
        minLength: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Mininum password has 8 characther' })
    @IsNotEmpty({ message: 'The password field can not be empty' })
    password!: string 
}