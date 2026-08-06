import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto'
import { LoginUserDto } from './dto/login.dto'
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt'
import { email } from 'zod';
import id from 'zod/v4/locales/id.js';

@Injectable()
export class AuthService {
    constructor (
        private readonly prismaService : PrismaService,
        private readonly jwtService : JwtService,
        private readonly usersService : UsersService,
    ) {}

    async register(registerUserDto: RegisterUserDto) {
        const existingUser = await this.prismaService.user.findUnique({
          where: {
            email: registerUserDto.email
          }  
        })

        if (existingUser) {
            throw new BadRequestException('Email sudah terdaftar')
        }

        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

        const result = await this.prismaService.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: registerUserDto.name,
                    email: registerUserDto.email,
                    password: hashedPassword,
                    phoneNumber: registerUserDto.phoneNumber,
                    role: 'OWNER' 
                }
            })

            const petOwner = await tx.petOwner.create({
                data: {
                    userId: user.id,
                    address: registerUserDto.address
                }
            });

            return { user, petOwner }
        });

        const token = await this.jwtService.signAsync({
            sub: result.user.id,
            email: result.user.email,
            role: result.user.role,
        })

        return {
            status: 201,
            message: "User registered succesfully",
            data: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                phoneNumber: result.petOwner.address,
                role: result.user.role,
                token: token,
            },
        };
    }

    async login( loginUserDto : LoginUserDto ) {
        // 1. Cari dulu emailnya ada di register user apa enggak?
        const user = await this.usersService.findOne(loginUserDto.email)
        if (!user) {
            throw new UnauthorizedException('Email atau password salah')
        }
        // 2. Bandingin Password
        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah')
        }
        // 3. Generate JWT Token
        const payload = { sub: user.id, email: user.email, role: user.role }
        const token = await this.jwtService.signAsync(payload)

        // 4. Return persis sesuai Api Spec
        return {
            status: 200,
            message: 'Login successful',
            data: {
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            } 
        }
    }
}
