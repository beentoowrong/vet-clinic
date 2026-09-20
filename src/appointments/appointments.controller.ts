import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateAppointmentResponseDto } from './dto/create-appointment-responses.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { ActiveUserData } from 'src/auth/interface/active-user-data.interface';

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
}
