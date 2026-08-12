import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role, User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';

@Injectable()
export class UsersService {
    constructor (
        private readonly prismaService : PrismaService
    ){}

    // find user by email
    async findOne(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where : { email }
        })
    }

    // find user by id
    async findById(id: number): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where : { id }
        })
    }

    // find all 
    async findAll() {
        const users = await this.prismaService.user.findMany({
            select: {
                id : true,
                email: true,
                name: true,
                role: true,
            },
        });

        return {
            status: 200,
            message: 'Daftar semua users berhasil diambil',
            data : users
        }
    }


    // Create User By Admin or Super Admin
    async CreateUser(createUserDto : CreateUserDto, currentUser : ActiveUserData): Promise<CreateUserResponseDto> {
        // cek aturan pembuatan role berdasarkan role pengakses
        if (
            currentUser.role === Role.ADMIN && 
            (createUserDto.role === Role.ADMIN || createUserDto.role === Role.SUPER_ADMIN)
        ) {
            throw new ForbiddenException('You are not allowed to create Admin')
        }

        // cek apakah email sudah terdaftar di database 
        const existingUser = await this.findOne(createUserDto.email)
        if (existingUser) {
            throw new BadRequestException('Email already registered')
        }

        // hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

        // simpen user baru ke database
        const newUser = await this.prismaService.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
                phoneNumber: createUserDto.phoneNumber,
                role: createUserDto.role,
            }
        })

        return {
            status: 200,
            message: 'User created successfully',
            data : {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
            }
        }
    }
}