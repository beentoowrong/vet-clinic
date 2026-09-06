import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBreedDto {
  @ApiProperty({ example: 'Maine Coon' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  speciesId!: number;
}
