import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class ChangePasswordDto {
    @ApiProperty ({
        description: 'Password lama pengguna',
        example: 'supersecretoldpassword123',
        minLength: 8
    })
    @IsString({ message: 'Password lama harus berupa string' })
    @IsNotEmpty({ message: 'Password lama tidak boleh kosong' })
    @MinLength(8, { message: 'Password lama minimal 8 karakter' })
    old_password!: string;

    @ApiProperty ({
        description: 'Password baru pengguna',
        example: 'supersecretoldpassword123',
        minLength: 8
    })
    @IsString({ message: 'Password baru harus berupa string' })
    @IsNotEmpty({ message: 'Password baru tidak boleh kosong' })
    @MinLength(8, { message: 'Password baru minimal 8 karakter' })
    new_password!: string;

    @ApiProperty ({
        description: 'Password baru pengguna',
        example: 'supersecretoldpassword123',
        minLength: 8
    })
    @IsString({ message: 'Konfirmasi password baru harus berupa string' })
    @IsNotEmpty({ message: 'Konfirmasi password baru tidak boleh kosong' })
    @MinLength(8, { message: 'Konfirmasi password baru minimal 8 karakter' })
    new_password_confirmation!: string;

}