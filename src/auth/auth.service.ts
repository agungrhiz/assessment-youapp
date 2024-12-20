import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, username, password } = registerDto;

    const exists = await this.usersService.exists(email, username);
    if (exists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashedPassword(password);

    const user = await this.usersService.create({
      email,
      username,
      password: hashedPassword,
    });

    return user;
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { emailOrUsername, password } = loginDto;

    const user = await this.usersService.findByEmailOrUsername(emailOrUsername);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async hashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
