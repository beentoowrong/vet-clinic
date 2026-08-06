import { ApiProperty } from "@nestjs/swagger";

export class LogoutResponseDto {
    @ApiProperty({
        description: 'Logout confirmed messages',
        example: 'User logout successfully',
    })
    message!: string;

    @ApiProperty({
        description: 'Status code',
        example: 200,
    })
    statusCode!: number;
}
