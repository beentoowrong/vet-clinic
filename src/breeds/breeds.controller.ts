import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BreedsService } from './breeds.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateBreedDto } from './dto/create-breed.dto';

@ApiTags('Breeds')
@Controller('breeds')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all breeds, optionally filter by speciesId' })
  @ApiQuery({ name: 'speciesId', required: false, type: Number })
  async findAll(@Query('speciesId') speciesId?: string) {
    const id = speciesId ? parseInt(speciesId, 10) : undefined;
    return this.breedsService.findAll(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get breed by ID with its species' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.breedsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new breed (admin only)' })
  async create(@Body() dto: CreateBreedDto) {
    return this.breedsService.create(dto.name, dto.speciesId);
  }
}
