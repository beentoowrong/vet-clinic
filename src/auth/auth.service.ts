import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto'
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor (
        private readonly prismaService : PrismaService,
        private readonly jwtService : JwtService,
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
}
