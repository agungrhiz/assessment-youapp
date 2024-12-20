import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enum/gender.enum';
import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  interests: string[];
}
