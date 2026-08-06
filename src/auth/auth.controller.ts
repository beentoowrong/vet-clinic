import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';

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

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login User' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: LoginResponseDto, // Swagger akan menampilkan JSON bertingkat 
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid email or password',
    })
    async login (@Body() loginUserDto : LoginUserDto) {
        return await this.authService.login(loginUserDto)
    }
}


"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoiZHJhZ29zQGV4YW1wbGUuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzg2MDA5ODY5LCJleHAiOjE3ODYwOTYyNjl9.dKLNHt8aPSjwufv_877cclK9xW4aj76TTzGTCordlxY"