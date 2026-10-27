import { ApiProperty } from "@nestjs/swagger";
import { PrescriptionDto } from "./create-prescription.dto";


export class PrescriptionResponseDto {
    @ApiProperty({ example: 201 })
    status!: number

    @ApiProperty({ example: "Successfully created " })
    message!: string

    @ApiProperty({ type: [PrescriptionDto]})
    data!: PrescriptionDto
}