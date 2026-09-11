import { Injectable, Inject, NotFoundException, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Logger } from 'winston';
import { CreatePetDto } from './dto/create-pet.dto';
import { CreatePetResponseDto } from './dto/create-pet-response.dto';
import { ActiveUserData } from '../auth/interface/active-user-data.interface';
import { Role } from 'generated/prisma/enums';
import { PaginationDto } from './dto/pagination.dto'
import { PaginatedPetsResponseDto } from './dto/paginated-pets-response.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

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
      const petOwner = await this.prismaService.petOwner.upsert({
        where: { userId: currentUser.id },
        create: { userId: currentUser.id },
        update: {},
      });
      targetOwnerId = petOwner.id;
    } else {
      if (!createPetDto.ownerId) {
        throw new NotFoundException({
          status: 404,
          message: 'ownerId is required when created by Admin / Super Admin',
          data: null,
        });
      }

      const petOwner = await this.prismaService.petOwner.findUnique({
        where: { userId: createPetDto.ownerId },
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

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum
    
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

  async findPetById(@Param('id', ParseIntPipe) PetId: number) {
    const pet = await this.prismaService.pet.findUnique({
      where: { id: PetId },
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
    });

    if (!pet) {
      return null
    };

    return {
      status: 200,
      message: 'Success',
      data: pet,
    };
  }

  async getAllMyPets(currentUser: ActiveUserData){
    if (currentUser.role === Role.OWNER) {
      const petOwner = await this.prismaService.petOwner.findUnique({
        where: { userId: currentUser.id }
      });

      const pets = await this.prismaService.pet.findMany({
        where: { ownerId: petOwner?.id },
        select: {
          id: true,
          name: true,
          gender: true,
          age: true,
          weightKg: true,
          specialMarks: true,
          species: {
            select :{
              name: true,
            }
          },
          breed: {
            select: {
              name: true
            },
          },
          isSterilized: true,
          createdAt: true,
        }
      });
      
      return {
        status: 200,
        message: 'Success',
        data: pets
      }
    }
  }

  async updatePet(currentUser: ActiveUserData, petId: number, updatePetDto: UpdatePetDto) {
    // 1. Cari pet yang mau diupdate
    const existingPet = await this.prismaService.pet.findUnique({
      where: { id: petId },
      select: { id: true, ownerId: true, createdBy: true },
    });

    if (!existingPet) {
      throw new NotFoundException({
        status: 404,
        message: 'Pet not found',
        data: null,
      });
    }

    // 2. Cek hak akses berdasarkan role
    if (currentUser.role === Role.OWNER) {
      // OWNER: auto-buat profil jika belum ada, lalu cek kepemilikan
      const petOwner = await this.prismaService.petOwner.upsert({
        where: { userId: currentUser.id },
        create: { userId: currentUser.id },
        update: {},
      });

      if (existingPet.ownerId !== petOwner.id) {
        throw new ForbiddenException('You can only update your own pets');
      }
    } else {
      // ADMIN / SUPER_ADMIN: hanya boleh update pet yang dibuat admin
      const creator = await this.prismaService.user.findUnique({
        where: { id: existingPet.createdBy },
        select: { role: true },
      });

      if (!creator || (creator.role !== Role.ADMIN && creator.role !== Role.SUPER_ADMIN)) {
        throw new ForbiddenException('Admin can only update pets created by admin');
      }
    }

    // 3. Build data update (hanya credential, ownerId tidak bisa diubah)
    const { name, speciesId, breedId, gender, age, weightkg, specialMarks, isSterilized } = updatePetDto

    const data: any = {}
    if (name !== undefined) data.name = name
    if (speciesId !== undefined) data.speciesId = speciesId
    if (breedId !== undefined) data.breedId = breedId
    if (gender !== undefined) data.gender = gender
    if (age !== undefined) data.age = age
    if (weightkg !== undefined) data.weightKg = weightkg
    if (specialMarks !== undefined) data.specialMarks = specialMarks
    if (isSterilized !== undefined) data.isSterilized = isSterilized
    
    const updatePet = await this.prismaService.pet.update({
      where : { id : petId },
      data,
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
    })

    return {
      status: 200,
      message: 'success',
      data: updatePet,
    }
  }

  async deletePet(currentUser: ActiveUserData, petId: number) {
    const existingPet = await this.prismaService.pet.findUnique({
      where: { id: petId },
      select: { id: true, ownerId: true }
    });

    if (!existingPet) {
      throw new NotFoundException('Pet Not Found')
    }

    if (currentUser.role === Role.OWNER) {
      const petOwner = await this.prismaService.petOwner.findUnique({
        where: { userId: currentUser.id }
      })

      if(!petOwner || existingPet.ownerId !== petOwner.id) {
        throw new ForbiddenException('You can only delete your own pets')
      }
    }

    await this.prismaService.pet.delete({
      where: { id: petId }
    })

    return {
      status: 200,
      message: 'Pet deleted successfully'
    }
  }
}
