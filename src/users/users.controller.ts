import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth-request';
import { ProfileDto } from './dto/profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-access-token',
  description: 'Access Token',
  required: true,
})
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create profile' })
  @Post('createProfile')
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: ProfileDto }> {
    const data = await this.usersService.updateProfile(
      req.user.sub,
      createUserDto,
    );

    return { message: 'User has been created successfully', data };
  }

  @ApiOperation({ summary: 'Get profile' })
  @Get('getProfile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<{ message: string; data: ProfileDto }> {
    const data = await this.usersService.getProfile(req.user.sub);

    return { message: 'Profile has been found successfully', data };
  }

  @ApiOperation({ summary: 'Update profile' })
  @Put('updateProfile')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; data: ProfileDto }> {
    const data = await this.usersService.updateProfile(
      req.user.sub,
      updateUserDto,
    );

    return { message: 'Profile has been updated successfully', data };
  }

  @ApiOperation({ summary: 'Update profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('uploadProfile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const extension = file.originalname.split('.').pop();
          callback(null, `${uuidv4()}.${extension}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateProfilePicture(
    @Request() req: AuthenticatedRequest,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    await this.usersService.updateProfilePicture(req.user.sub, file.filename);

    return {
      message: 'Profile picture has been updated successfully',
    };
  }

  @ApiOperation({ summary: 'Get profile picture' })
  @Get('profilePicture')
  async showProfilePicture(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const profilePicture = await this.usersService.getProfilePicture(
      req.user.sub,
    );

    return res.sendFile(profilePicture, { root: './uploads' });
  }
}
