import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordResponseDto {
    @ApiProperty ({
        description: 'Status code HTTP Response',
        example: 200
    })
    status! : number

    @ApiProperty({
        description: 'Responses message',
        example: 'Password changed successfully'
    })
    message!: string
}