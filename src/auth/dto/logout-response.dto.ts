import { ApiProperty } from "@nestjs/swagger";

export class LogoutResponseDto {
    @ApiProperty({
        description: 'Status code',
        example: 200,
    })
    status!: number;

    @ApiProperty({
        description: 'Logout confirmed messages',
        example: 'User logout successfully',
    })
    message!: string;
}
