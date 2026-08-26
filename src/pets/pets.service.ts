import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { exceptions, Logger } from 'winston';
import { CreatePetDto } from './dto/create-pet.dto';
import { CreatePetResponseDto } from './dto/create-pet-response.dto';
import { ActiveUserData } from '../auth/interface/active-user-data.interface'
import { Role } from 'generated/prisma/enums';


@Injectable()
export class PetsService {
    constructor(
        private readonly prismaService : PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger : Logger
    ){}


    async createPet (currentUser: ActiveUserData, createPetDto: CreatePetDto): Promise<CreatePetResponseDto> {
        let targetOwnerId: number;

        // 1. menentukan target ownerId berdasarkan Role
        if (currentUser.role === Role.OWNER) {
            // jika OWNER: Cari ID PetOwner milik user yang sedang login
            const petOwner = await this.prismaService.petOwner.findUnique({
                where : { userId: currentUser.id },
            })

            if (!petOwner) {
                throw new NotFoundException({
                    status: 404,
                    message: 'Pet Owner profile not found for current user',
                    data: null,
                });
            }
            targetOwnerId = petOwner.id
        } else {
            // jika Admin / Super Admin: wajib ada ownerId di Request Body
            if (!createPetDto.ownerId) {
                throw new NotFoundException({
                    status: 404,
                    message: 'ownerId is required when created by Admin / Super Admin',
                    data: null,
                })
            }

            // pastikan PetOwner yang di assign benar benar ada di database
            const petOwner = await this.prismaService.petOwner.findUnique({
                where: { id: createPetDto.ownerId }
            });

            if (!petOwner) {
                throw new NotFoundException({
                    status: 404,
                    messsage: `Pet owner with ID ${ createPetDto.ownerId } not found`,
                    data: null
                })
            }

            targetOwnerId = petOwner.id
        }

        // 2. Buat pet baru di database
        const newPet = await this.prismaService.pet.create({
            data: {
                ownerId: targetOwnerId,
                name: createPetDto.name,
                species: createPetDto.speciesId,
            }
        })
    }
}
