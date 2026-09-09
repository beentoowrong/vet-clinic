import { Body, Controller, Post, Query, UseGuards, Get, ParseIntPipe, Param, NotFoundException, Patch } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PetsService } from './pets.service';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedPetsResponseDto } from './dto/paginated-pets-response.dto'
import { UpdatePetDto } from './dto/update-pet.dto'

@ApiTags('Pets')
@ApiBearerAuth('JWT-auth')
@Controller('pets')
@UseGuards(JwtAuthGuard, RoleGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Register a pet' })
  async createPet(
    @CurrentUser() user: ActiveUserData,
    @Body() createPetDto: CreatePetDto,
  ) {
    return this.petsService.createPet(user, createPetDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: 'Get All Pets Pagination' })
  async getAllPetPagination (@Query() PaginationDto: PaginationDto): Promise<PaginatedPetsResponseDto> {
    return this.petsService.findAllPaginatedPet(PaginationDto)
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: 'Get Pet By ID' })
  async findOnePetById(@Param('id', ParseIntPipe) id: number ) {
    const result = await this.petsService.findPetById(id)

    if (!result) {
      throw new NotFoundException('User tidak ditemukan')
    }

    return result;
  }


  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OWNER)
  async updatePetByOwner (
      @CurrentUser() currentUser: ActiveUserData,
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePetDto : UpdatePetDto
    ) {
      return this.petsService.updatePetByOwner(currentUser, id, updatePetDto)
  }
}
