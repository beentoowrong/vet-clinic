import { ApiProperty } from "@nestjs/swagger";
import { CreatePrescriptionDto } from "./create-prescription.dto";


export class PrescriptionResponseDto {
    @ApiProperty({ example: 201 })
    status!: number

    @ApiProperty({ example: "Successfully created " })
    message!: string

    @ApiProperty({ type: [CreatePrescriptionDto]})
    data!: CreatePrescriptionDto
}