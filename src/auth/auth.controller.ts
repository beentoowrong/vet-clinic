import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor( private readonly authService : AuthService ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED) // Menandakan HTTP Status 201 Created

    @ApiOperation({
        summary: 'Register User',
        description: 'Pendaftaran mandiri oleh Pemilik Hewan (Pet Owner)'
    })

    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: RegisterUserDto
    })

    @ApiResponse({
        status: 400,
        description: 'Bad Request / Validasi Gagal / Email Sudah Terdaftar'
    })

    async register (@Body() registerUserDto: RegisterUserDto) {
        return await this.authService.register(registerUserDto)
    }
}
