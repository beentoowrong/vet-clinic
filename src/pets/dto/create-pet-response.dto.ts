import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "generated/prisma/enums";

export class PetDataDto {
    @ApiProperty({ example: 'Pororo' })
    name!: string;
    
    @ApiProperty({ example: 1 })
    speciesId!: number;
    
    @ApiProperty({ example: 1 })
    breedId?: number;
    
    @ApiProperty({ enum: Gender, example: Gender.MALE })
    gender! : Gender;
    
    @ApiProperty({ example: 1 })
    age!: number;
    
    @ApiProperty({ example: 4.2 })
    weightkg!: number;
    
    @ApiProperty({ example: 'White color and blue eyes' })
    specialMarks!: string;
    
    @ApiProperty({ type: Boolean, example: true})
    isSterilized!: boolean;
}

export class CreatePetResponseDto {
    status!: number;
    message!: string;
    data!: PetDataDto;
}