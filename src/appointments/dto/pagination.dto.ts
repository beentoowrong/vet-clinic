import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsNumber, Min} from "class-validator";
import { AppointmentStatus, ServiceType } from "generated/prisma/enums";


export class PaginationDto {
    @ApiProperty({
        description: 'Page number (1-based)',
        example: 1,
        minimum: 1,
        default: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;
    
    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        default: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1) 
    limit?: number = 10;
    
    @ApiProperty({
        description: 'Search term for name of pet',
        example: 'Pororo',
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: 'Filter by appointment ID',
        example: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    id?: number;

    @ApiProperty({
        description: 'Search from appointment code',
        example: 'APPT-26932280',
        required: false,
    })
    @IsOptional()
    @IsString()
    appointmentCode?: string;

    @ApiProperty({
        description: 'Filter by service type',
        enum: ServiceType,
        example: ServiceType.HOME_VISIT,
        required: false,
    })
    @IsOptional()
    @IsEnum(ServiceType)
    serviceType?: ServiceType;

    @ApiProperty({
        description: 'Filter by appointment status',
        enum: AppointmentStatus,
        example: AppointmentStatus.CONFIRMED,
        required: false,
    })
    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;
}