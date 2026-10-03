import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards, Get, Query, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateAppointmentResponseDto } from './dto/create-appointment-responses.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedAppointmentsResponseDto } from './dto/pagination-appointment-response.dto';


@ApiTags('Appointments')
@ApiBearerAuth('JWT-auth')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RoleGuard)
export class AppointmentsController {
    constructor(private readonly appointmentService : AppointmentsService){}

    @Post()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OWNER)
    @ApiOperation({ summary: 'Create New Appointment' })
    @ApiResponse({ status: 201, type: CreateAppointmentResponseDto })
    async create(
        @CurrentUser() user: ActiveUserData,
        @Body() dto: CreateAppointmentDto,
    ): Promise<CreateAppointmentResponseDto> {
        return this.appointmentService.createAppointment(user, dto);
    }

    @Patch(':id/cancel')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OWNER)
    @ApiOperation({ summary: 'Cancel appointment' })
    async cancel(
        @CurrentUser() user: ActiveUserData,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CancelAppointmentDto,
    ) {
        return this.appointmentService.cancelAppointment(user, id, dto);
    }

    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OWNER)
    @ApiOperation({ summary: 'Update appointment' })
    async update(
        @CurrentUser() user: ActiveUserData,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAppointmentDto: UpdateAppointmentDto,
    ) {
        return this.appointmentService.updateAppointment(user, id, updateAppointmentDto);
    }

    @Get()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
    @ApiOperation({ summary: 'Get All Appointment Pagination' })
    async getAllPetPagination (@Query() PaginationDto: PaginationDto): Promise<PaginatedAppointmentsResponseDto> {
        return this.appointmentService.findAllAppointment(PaginationDto)
    }

    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
    @ApiOperation({ summary: 'Get appointment By ID' })
    async findOneAppointmentById(@Param('id', ParseIntPipe) AppointmentId: number){
        const result = await this.appointmentService.getAppointmentById(AppointmentId)

        if(!result) {
            throw new NotFoundException('Appointment tidak ditemukan')
        }

        return result;
    }
}
