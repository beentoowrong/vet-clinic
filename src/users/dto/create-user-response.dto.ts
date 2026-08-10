import { ApiProperty } from "@nestjs/swagger";
import { UserDataDto } from "./user-data.dto";

export class CreateUserResponseDto {
    @ApiProperty({ example: 201 })
    status!: number;

    @ApiProperty({ example: 'User created successfully' })
    message!: string;

    @ApiProperty({ type: UserDataDto })
    data!: UserDataDto;
}