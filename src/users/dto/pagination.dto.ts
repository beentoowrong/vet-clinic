import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, IsEnum } from "class-validator";
import { Role } from "generated/prisma/enums";


export class PaginationDto {
    @ApiProperty({
        description: 'Page number (1-based)',
        example: 1,
        minimum: 1,
        default: 1,
        required: false
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
        required: false
    })
    limit?: number = 10;

    @ApiProperty({
        description: 'Search term for email or name',
        example: 'johndoe@example.com',
        required: false

    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: 'Filter by user role',
        enum: Role,
        example: Role.OWNER,
        required: false
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}