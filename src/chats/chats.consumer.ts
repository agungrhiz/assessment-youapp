import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ChatsConsumer {
  constructor() {}

  @EventPattern('notify-user')
  async handleNotifyUser(
    @Payload() data: { receiver: string; message: string },
  ) {
    const { receiver, message } = data;
    console.log(`Notification for ${receiver}: ${message}`);
  }
}
