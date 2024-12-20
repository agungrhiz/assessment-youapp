import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  birthday: Date;

  @ApiProperty()
  horoscope: string;

  @ApiProperty()
  zodiac: string;

  @ApiProperty()
  height: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  interests: string[];
}
