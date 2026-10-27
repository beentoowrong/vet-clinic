import { ApiProperty } from "@nestjs/swagger";
import { MedicalRecordPrescriptionResponseDto } from "./create-medical-record-response.dto";
import { PrescriptionDto } from "./prescription.dto";


export class PrescriptionResponseDto {
    @ApiProperty({ example: 201 })
    status!: number

    @ApiProperty({ example: "Successfully created " })
    message!: string

    @ApiProperty({ type: [PrescriptionDto]})
    data!: PrescriptionDto
}