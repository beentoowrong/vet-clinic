import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Logger } from 'winston';
import { CreatePetDto } from './dto/create-pet.dto';
import { CreatePetResponseDto } from './dto/create-pet-response.dto';
import { ActiveUserData } from '../auth/interface/active-user-data.interface';
import { Role } from 'generated/prisma/enums';
import { PaginationDto } from './dto/pagination.dto'
import { PaginatedPetsResponseDto } from './dto/paginated-pets-response.dto';

@Injectable()
export class PetsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  async createPet(
    currentUser: ActiveUserData,
    createPetDto: CreatePetDto,
  ): Promise<CreatePetResponseDto> {
    let targetOwnerId: number;

    if (currentUser.role === Role.OWNER) {
      // OWNER: selalu pakai ID sendiri, ownerId dari body DIABAIKAN
      const petOwner = await this.prismaService.petOwner.findUnique({
        where: { userId: currentUser.id },
      });

      if (!petOwner) {
        throw new NotFoundException({
          status: 404,
          message: 'Pet Owner profile not found for current user',
          data: null,
        });
      }
      targetOwnerId = petOwner.id;
    } else {
      // ADMIN / SUPER_ADMIN: ownerId wajib dari body
      if (!createPetDto.ownerId) {
        throw new NotFoundException({
          status: 404,
          message: 'ownerId is required when created by Admin / Super Admin',
          data: null,
        });
      }

      const petOwner = await this.prismaService.petOwner.findUnique({
        where: { id: createPetDto.ownerId },
      });

      if (!petOwner) {
        throw new NotFoundException({
          status: 404,
          message: `Pet owner with ID ${createPetDto.ownerId} not found`,
          data: null,
        });
      }

      targetOwnerId = petOwner.id;
    }

    const newPet = await this.prismaService.pet.create({
      data: {
        ownerId: targetOwnerId,
        name: createPetDto.name,
        speciesId: createPetDto.speciesId,
        breedId: createPetDto.breedId,
        gender: createPetDto.gender,
        age: createPetDto.age,
        weightKg: createPetDto.weightkg,
        specialMarks: createPetDto.specialMarks,
        isSterilized: createPetDto.isSterilized,
        createdBy: currentUser.id,
      },
    });

    return {
      status: 201,
      message: 'Pet created successfully',
      data: {
        name: newPet.name,
        speciesId: newPet.speciesId,
        breedId: newPet.breedId,
        gender: newPet.gender,
        age: newPet.age,
        weightKg: newPet.weightKg,
        specialMarks: newPet.specialMarks,
        isSterilized: newPet.isSterilized,
        createdBy: newPet.createdBy
      },
    };
  }

  async findAllPaginatedPet(paginationDto: PaginationDto): Promise<PaginatedPetsResponseDto> {
    const { search, speciesId, gender, page = 1, limit = 10  } = paginationDto;

    // convert ke number terlebih dahulu
    const pageNum = Number(page)
    const limitNum = Number(limit)

    // 1. Hitung nilai skip untuk prisma offset pagination
    const skip = (pageNum - 1) * limitNum
    
    // 2. Buat kondisi filter dinamis
    let whereCondition: any = {};

    if (gender) {
      whereCondition.gender = gender;
    } 

    if (speciesId) {
      whereCondition.speciesId = speciesId;
    }

    if (search) {
      whereCondition = { name: { contains: search, mode: 'insensitive' } }
    }

    const [pets, totalData] = await Promise.all([
      this.prismaService.pet.findMany({
        where: {
          ...whereCondition
        },
        skip: skip,
        take: limitNum,
        select: {
          id: true,
          name: true,
          species: {
            select: {
              id: true,
              name: true,
            }
          },
          breed: {
            select: {
              id: true,
              name: true,
            }
          },
          gender: true,
          age: true,  
          weightKg: true,
          specialMarks: true,
          isSterilized: true,
          owner: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                }
              }
            }
          },
          createdBy: true,
          createdAt: true,
        },
        orderBy: {
          id: 'asc'
        },
      }),
      this.prismaService.pet.count({
        where: whereCondition
      })
    ])

    // 4. Hitung total halaman
    const totalPages = Math.ceil(totalData / limitNum)

    return {
      status: 200,
      message: 'Success',
      data: pets,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalData: totalData,
        totalPages: totalPages
      }
    }
  }
}
