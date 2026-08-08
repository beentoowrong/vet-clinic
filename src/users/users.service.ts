import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';


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
    async CreateUser(createUserDto : CreateUserDto, currentUser : any) {
        
    }
}
