import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role, User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PaginationDto } from './dto/pagination.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


@Injectable()
export class UsersService {
    constructor (
        private readonly prismaService : PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger : Logger
    ){}

    // Find user by email
    async findOne(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where : { email }
        })
    }

    // Find user by id
    async findById(id: number): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where : { id }
        })
    }

    // Find all 
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

    // Find one user by ID
    async findOneById(id: number) {
        const user = await this.prismaService.user.findUnique({
            where : { id },
            select : {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        })

        if(!user) {
            return null
        }

        return {
            status: 200,
            message: "Success",
            data: user
        }
    }

    // Create User By Admin or Super Admin
    async createUser(createUserDto : CreateUserDto, currentUser : ActiveUserData): Promise<CreateUserResponseDto> {
        this.logger.debug(`UserService.createUser( ${ JSON.stringify(currentUser)}, ${ JSON.stringify(createUserDto)} )`)
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

    // Find all data user with paginated
    async findAllPaginated(paginationDto : PaginationDto) {
        const { role, search, page = 1, limit = 10 } = paginationDto;

        // convert ke number untuk memastikan tipe data akurat
        const pageNum = Number(page)
        const limitNum = Number(limit)

        // 1. Hitung nilai skip untuk prisma offset pagination
        const skip = (pageNum - 1) * limitNum;

        // 2. Buat kondisi filter dinamis
        const whereCondition : any = {};

        if (role) {
            whereCondition.role = role;
        }

        if (search) {
            whereCondition.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        // 3. Ambil data & hitung total data secara paralel
        const [users, totalData] = await Promise.all([
            this.prismaService.user.findMany({
                where: whereCondition,
                skip: skip,
                take: limitNum,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                },
                orderBy: {
                    id: 'asc'
                }
            }),
            this.prismaService.user.count({
                where: whereCondition,
            })
        ]);

        // 4. Hitung total halaman
        const totalPages = Math.ceil(totalData / limitNum)

        return {
            status : 200,
            messsage: 'Success',
            data : users,
            meta: {
                page: pageNum,
                limit: limitNum,
                totalData: totalData,
                totalPages: totalPages
            }
        }
    }
}