import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { CreateMedicalRecordResponseDto } from './dto/create-medical-record-response.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordPaginationDto } from './dto/pagination-medical-record.dto';
import { PaginatedMedicalRecordsResponseDto } from './dto/pagination-medical-record-response.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';



@ApiTags('Medical Record')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('medical-records')
export class MedicalRecordsController {
    constructor(
        private readonly medicalRecordService : MedicalRecordsService
    ) {}

    @Post(':appointmentId')
    @Roles(Role.DOCTOR)
    @ApiResponse({
        status: 201,
        description: 'Medical Record Successfuly Created',
        type: CreateMedicalRecordResponseDto,
    })
    async create(
        @CurrentUser() user: ActiveUserData,
        @Param('appointmentId', ParseIntPipe) appointmentId: number, 
        @Body() dto: CreateMedicalRecordDto 
        ): Promise<CreateMedicalRecordResponseDto> { 
        return this.medicalRecordService.createMedicalRecord(user, dto, appointmentId)
    }


    @Get()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.OWNER)
    @ApiResponse({ status: 200, type: PaginatedMedicalRecordsResponseDto })
    async findAll(
        @CurrentUser() user: ActiveUserData,
        @Query() dto: MedicalRecordPaginationDto,
    ): Promise<PaginatedMedicalRecordsResponseDto> {
        return this.medicalRecordService.findAllMedicalRecords(user, dto);
    }

    @Patch(':medicalRecordId')
    @Roles(Role.DOCTOR)
    @ApiResponse({
        status: 200,
        description: 'Medical record updated successfully',
        type: UpdateMedicalRecordDto,
    })
    async updated(
        @CurrentUser() user: ActiveUserData,
        @Param('medicalRecordId', ParseIntPipe) medicalRecordId : number,
        @Body() dto : UpdateMedicalRecordDto){
            return this.medicalRecordService.updateMedicalRecord(user, dto, medicalRecordId)
    }

    @Post(':medicalRecordId/prescription')
    @Roles(Role.DOCTOR)
        @ApiResponse({
        status: 200,
        description: 'Prescription successfully created',
        type: CreatePrescriptionDto,
    })
    async createPrescription(
        @CurrentUser() user: ActiveUserData,
        @Param('medicalRecordId', ParseIntPipe) medicalRecordId : number,
        @Body() createPrescriptionDto : CreatePrescriptionDto 
    ) {
        return this.medicalRecordService.createPrescriptionMedicalRecordId(user, createPrescriptionDto, medicalRecordId)
    }

    @Patch(':medicalRecordId/prescription/:prescriptionId')
    updatePrescription(
        @CurrentUser() currentUser: ActiveUserData,
        @Param('medicalRecordId', ParseIntPipe) medicalRecordId: number,
        @Param('prescriptionId', ParseIntPipe) prescriptionId: number,
        @Body() updatePrescriptionDto: UpdatePrescriptionDto,
    ) {
        return this.medicalRecordService.updatePrescription(
            currentUser,
            updatePrescriptionDto,
            medicalRecordId,
            prescriptionId,
        );
    }
}
