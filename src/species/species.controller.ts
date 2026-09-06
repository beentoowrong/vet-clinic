import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SpeciesService } from './species.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateSpeciesDto } from './dto/create-species.dto';

@ApiTags('Species')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all species with their breeds' })
  async findAll() {
    return this.speciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get species by ID with its breeds' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.speciesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new species (admin only)' })
  async create(@Body() dto: CreateSpeciesDto) {
    return this.speciesService.create(dto.name);
  }
}
