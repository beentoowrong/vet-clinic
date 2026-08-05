import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService : AuthService ) {}
    @Post('register')
    async register (@Body() request: RegisterUserDto) {
        return this.authService.register(request)

    }
}
