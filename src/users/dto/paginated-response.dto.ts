import { ApiProperty } from "@nestjs/swagger";
import { UserDataDto } from "./user-data.dto";


export class PaginationMetaDto {
    @ApiProperty({ description: 'Current page number', example: 1 })
    page?: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    limit?: number;

    @ApiProperty({ description: 'Total number of items', example: 25 })
    totalData?: number;

    @ApiProperty({ description: 'Total number of pages', example: 3 })
    totalPages?: number;
}

export class PaginatedUsersResponseDto {
    @ApiProperty({ example: 200 })
    status!: number;

    @ApiProperty({ example: 'Success' })
    message!: string;

    @ApiProperty({ type: [UserDataDto] })
    data?: UserDataDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta?: PaginationMetaDto;
}