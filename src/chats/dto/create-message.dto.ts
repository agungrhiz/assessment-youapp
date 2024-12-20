import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
