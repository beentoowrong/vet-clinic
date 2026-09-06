import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

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
}
