import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { DoctorPaginationDto } from './dto/doctor-pagination.dto';
import { PaginatedDoctorsResponseDto } from './dto/paginated-doctors-response.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all doctors (public)' })
  async getAllDoctors(@Query() doctorPaginatedDto: DoctorPaginationDto): Promise<PaginatedDoctorsResponseDto> {
    return this.doctorsService.getAllDoctorPaginated(doctorPaginatedDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Doctor By ID' })
  async findOneDoctorById(@Param('id', ParseIntPipe) DoctorId: number) {
    const result = await this.doctorsService.getDoctorById(DoctorId)

    if (!result) {
      throw new NotFoundException('Doctor tidak ditemukan')
    }

    return result;
  }
}
