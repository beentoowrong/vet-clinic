import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "generated/prisma/enums";

export class CreatePetDto {
    @ApiProperty({ example: 3, description: 'Required for Admin/Super Admin, ignored for owner' })
    @IsOptional()
    @IsInt()
    ownerId?: number;

    @ApiProperty({ example: 'Pororo' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    speciesId!: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    breedId?: number;

    @ApiProperty({ enum: Gender, example: Gender.MALE })
    @IsEnum(Gender)
    @IsNotEmpty()
    gender! : Gender;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    age!: number;

    @ApiProperty({ example: 4.2 })
    @IsNumber()
    @IsNotEmpty()
    weightkg!: number;

    @ApiProperty({ example: 'White color and blue eyes' })
    @IsString()
    @IsNotEmpty()
    specialMarks?: string;

    @ApiProperty({ type: Boolean, example: true})
    @IsBoolean()
    isSterilized!: boolean;
}