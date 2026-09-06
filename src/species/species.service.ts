import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

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
}
