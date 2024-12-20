import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @Inject('CHATS_SERVICE') private readonly client: ClientProxy,
    private readonly userService: UsersService,
  ) {}

  async sendMessage(
    sender: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const { receiver, message } = createMessageDto;
    const receiverUser = await this.userService.findByEmailOrUsername(receiver);
    if (!receiverUser) {
      throw new BadRequestException('Receiver does not exist');
    }

    const createdMessage = await this.messageModel.create({
      sender,
      receiver,
      message,
    });

    try {
      this.client.emit('notify-user', { receiver, message });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to notify user: ${error.message}`,
      );
    }

    return createdMessage;
  }

  async viewMessages(receiver: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ receiver })
      .sort({ createdAt: -1 })
      .populate({
        path: 'sender',
        foreignField: 'username',
        select: 'username name profilePicture',
      })
      .exec();

    return messages;
  }
}
