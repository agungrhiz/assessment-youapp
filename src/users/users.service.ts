import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { ProfileDto } from './dto/profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(user: User): Promise<User> {
    return this.userModel.create(user);
  }

  async exists(email: string, username: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    return user !== null;
  }

  async findByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<UserDocument | undefined> {
    return this.userModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
  }

  async findById(id: string): Promise<UserDocument | undefined> {
    return this.userModel.findById(id);
  }

  async getProfile(id: string): Promise<ProfileDto | undefined> {
    const user = await this.findById(id);

    return user ? this.mapToProfileDto(user) : undefined;
  }

  async updateProfile(
    id: string,
    profile: CreateUserDto | UpdateUserDto,
  ): Promise<ProfileDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, profile, {
      new: true,
    });

    return this.mapToProfileDto(updatedUser);
  }

  async updateProfilePicture(
    id: string,
    profilePicture: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { profilePicture });
  }

  async getProfilePicture(id: string): Promise<string | undefined> {
    const user = await this.findById(id);

    return user?.profilePicture;
  }

  private mapToProfileDto(user: UserDocument): ProfileDto {
    return {
      email: user.email,
      username: user.username,
      name: user.name,
      birthday: user.birthday,
      horoscope: user.birthday
        ? this.calculateHoroscope(user.birthday)
        : undefined,
      zodiac: user.birthday ? this.calculateZodiac(user.birthday) : undefined,
      height: user.height,
      weight: user.weight,
      interests: user.interests ?? [],
    };
  }

  private calculateHoroscope(birthday: Date): string {
    const day = birthday.getDate();
    const month = birthday.getMonth() + 1;

    const horoscopes = [
      {
        name: 'Aries',
        start: { month: 3, day: 21 },
        end: { month: 4, day: 19 },
      },
      {
        name: 'Taurus',
        start: { month: 4, day: 20 },
        end: { month: 5, day: 20 },
      },
      {
        name: 'Gemini',
        start: { month: 5, day: 21 },
        end: { month: 6, day: 20 },
      },
      {
        name: 'Cancer',
        start: { month: 6, day: 21 },
        end: { month: 7, day: 22 },
      },
      { name: 'Leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
      {
        name: 'Virgo',
        start: { month: 8, day: 23 },
        end: { month: 9, day: 22 },
      },
      {
        name: 'Libra',
        start: { month: 9, day: 23 },
        end: { month: 10, day: 22 },
      },
      {
        name: 'Scorpio',
        start: { month: 10, day: 23 },
        end: { month: 11, day: 21 },
      },
      {
        name: 'Sagittarius',
        start: { month: 11, day: 22 },
        end: { month: 12, day: 21 },
      },
      {
        name: 'Capricorn',
        start: { month: 12, day: 22 },
        end: { month: 1, day: 19 },
      },
      {
        name: 'Aquarius',
        start: { month: 1, day: 20 },
        end: { month: 2, day: 18 },
      },
      {
        name: 'Pisces',
        start: { month: 2, day: 19 },
        end: { month: 3, day: 20 },
      },
    ];

    const horoscope = horoscopes.find(
      (h) =>
        (month === h.start.month && day >= h.start.day) ||
        (month === h.end.month && day <= h.end.day),
    );

    return horoscope ? horoscope.name : 'Unknown';
  }

  private calculateZodiac(birthday: Date): string {
    const chineseZodiac = [
      'Rat',
      'Ox',
      'Tiger',
      'Rabbit',
      'Dragon',
      'Snake',
      'Horse',
      'Goat',
      'Monkey',
      'Rooster',
      'Dog',
      'Pig',
    ];

    const year = birthday.getFullYear();
    return chineseZodiac[(year - 4) % 12];
  }
}
