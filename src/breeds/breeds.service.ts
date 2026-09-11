import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BreedDto } from './dto/breed.dto';

@Injectable()
export class BreedsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(speciesId?: number) {
    return this.prismaService.breed.findMany({
      where: speciesId ? { speciesId } : undefined,
      include: { species: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: number) {
    return this.prismaService.breed.findUnique({
      where: { id },
      include: { species: { select: { id: true, name: true } } },
    });
  }

  async create(name: string, speciesId: number) {
    const species = await this.prismaService.species.findUnique({ where: { id: speciesId } });
    if (!species) {
      throw new NotFoundException(`Species with ID ${speciesId} not found`);
    }

    const existing = await this.prismaService.breed.findUnique({
      where: { name_speciesId: { name, speciesId } },
    });
    if (existing) {
      throw new ConflictException(`Breed "${name}" already exists for species "${species.name}"`);
    }

    return this.prismaService.breed.create({
      data: { name, speciesId },
      include: { species: { select: { id: true, name: true } } },
    });
  }

  async update(id : number, breedDto : BreedDto) {
    const existing = await this.prismaService.breed.findUnique({
      where : { id }
    })

    if (!existing) {
      throw new NotFoundException('Breed not found')
    }

    const { name, speciesId } = breedDto

    const data: any = {}
    if ( name !== undefined ) data.name = name
    if ( speciesId !== undefined ) data.speciesId = speciesId

    const updateBreed = await this.prismaService.breed.update({
      where: { id },
      data,
    })

    return {
      status: 200,
      message: 'Breed updated successfully',
      data: updateBreed
    }
  }

  async delete(id: number) {
    const existing = await this.prismaService.breed.findUnique({
      where : { id }
    })

    if (!existing) {
      throw new NotFoundException('Breed not found')
    }

    const petCount = await this.prismaService.pet.count({
      where: { breedId: id }
    })

    if (petCount > 0) {
      throw new ConflictException(`Can not delete breed: ${petCount} pet still use this breed`)
    }

    await this.prismaService.breed.delete({
      where: { id }
    })

    return {
      status: 200,
      message: 'Breed deleted successfully'
    }
  }
}
