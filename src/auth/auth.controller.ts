import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { LogoutResponseDto } from './dto/logout-response.dto';

@ApiTags('Auth')
@Controller('/auth')
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Logout pengguna',
        description:
        'Logout pengguna dan invalidate token. Memerlukan Bearer token di header Authorization.',
    })
    @ApiResponse({
        status: 200,
        description: 'Logout successful',
        type: LogoutResponseDto  
    })
    async logout(@Request() req): Promise<LogoutResponseDto> {
        return this.authService.logout(req.user)
    }
}

