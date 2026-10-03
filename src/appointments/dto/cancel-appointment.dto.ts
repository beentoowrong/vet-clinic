import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CancelAppointmentDto {
    @ApiProperty({ example: 'Ada keperluan mendadak', required: false })
    @IsOptional()
    @IsString()
    cancelReason?: string;
}
