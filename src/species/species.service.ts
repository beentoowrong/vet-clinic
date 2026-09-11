import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SpeciesDto } from './dto/species.dto';

@Injectable()
export class SpeciesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.species.findMany({
      include: { breeds: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: number) {
    return this.prismaService.species.findUnique({
      where: { id },
      include: { breeds: { select: { id: true, name: true } } },
    });
  }

  async create(name: string) {
    const existing = await this.prismaService.species.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException(`Species "${name}" already exists`);
    }
    return this.prismaService.species.create({ data: { name } });
  }

  async update(id: number, speciesDto : SpeciesDto) {
    const existing = await this.prismaService.species.findUnique({
      where: { id }
    })
    if (!existing) {
      throw new NotFoundException('Species not found')
    }

    const { name } = speciesDto

    const data: any = {}
    if ( name !== undefined ) data.name = name
    

    const updateSpecies = await this.prismaService.species.update({
      where: { id },
      data,
    })

    return {
      status: 200,
      message: 'Species updated successfully',
      data: updateSpecies
    }
  }

  async delete(id: number)  {
    const existing = await this.prismaService.species.findUnique({
      where: { id }
    })
    if (!existing) {
      throw new NotFoundException('Species not found')
    }

    // cek apakah masih ada pet yang pakai species ini
    const petCount = await this.prismaService.pet.count({
      where: { speciesId: id }
    });

    if (petCount > 0) {
      throw new ConflictException(`Cannot delete species: ${petCount} pets still use this species`);
    }

    await this.prismaService.species.delete({
      where: { id }
    })

    return {
      status: 200,
      message: 'Species deleted successfully'
    }
  }
}
