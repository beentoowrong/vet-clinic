import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role, User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PaginationDto } from './dto/pagination.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { add, Logger } from 'winston';
import { UpdateMeDto } from './dto/update-user-profile.dto';


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

    // Get Me Current User 
    async getMe(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
                doctorProfile: {
                    select: {
                        id: true,
                        sipNumber: true,
                        specialization: true,
                        practiceDays: true,
                        startTime: true,
                        endTime: true,
                    },
                },
                petOwnerProfile: {
                    select: {
                        address: true,
                        emergencyContact: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException({
                status: 404,
                message: 'User not found',
                data: null,
            });
        }

        const { doctorProfile, petOwnerProfile } = user;
        const profile =
            user.role === Role.DOCTOR ? doctorProfile
            : user.role === Role.OWNER ? petOwnerProfile
            : null;

        return {
            status: 200,
            message: 'Success',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                createdAt: user.createdAt,
                ...(profile ? { profile } : {}),
            },
        };
    }

    // update current User
    async updateMe(userId: number, updateMeDto: UpdateMeDto) {
        this.logger.debug(`UserService.update( ${JSON.stringify(userId)}, ${JSON.stringify(updateMeDto)} )`)

        const currentUser = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!currentUser) {
            throw new NotFoundException({ status: 404, message: 'User not found', data: null });
        }

        const { name, phoneNumber, address, emergencyContact } = updateMeDto;

        const data: any = {};
        if (name !== undefined) data.name = name;
        if (phoneNumber !== undefined) data.phoneNumber = phoneNumber;

        if (address !== undefined || emergencyContact !== undefined) {
            if (currentUser.role !== Role.OWNER) {
                throw new ForbiddenException('Only pet owner can update address & emergency contact');
            }
            data.petOwnerProfile = {
                upsert: {
                    create: { address, emergencyContact },
                    update: { address, emergencyContact },
                },
            };
        }

        const updatedUser = await this.prismaService.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                petOwnerProfile: {
                    select: { id: true, address: true, emergencyContact: true },
                },
            },
        });

        return {
            status: 200,
            message: 'User updated successfully',
            data: updatedUser,
        };
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