import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto'

@Injectable()
export class AuthService {
    async register(registerUserDto: RegisterUserDto) {
        const {name, email, password, phoneNumber, address}
    }
}
