import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth-request';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-access-token',
  description: 'Access Token',
  required: true,
})
@Controller()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiOperation({ summary: 'Send message' })
  @Post('sendMessage')
  async sendMessage(
    @Request() req: AuthenticatedRequest,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatsService.sendMessage(req.user.username, createMessageDto);
  }

  @ApiOperation({ summary: 'Get all messages' })
  @Get('viewMessages')
  async viewMessages(@Request() req: AuthenticatedRequest) {
    return this.chatsService.viewMessages(req.user.username);
  }
}
