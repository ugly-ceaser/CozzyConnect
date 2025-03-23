import { Injectable, NestMiddleware } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class BlockingMiddleware implements NestMiddleware {
  constructor(private readonly chatService: ChatService) {}

  async use(socket: any, next: (error?: any) => void) {
    // Read senderId and receiverId from handshake.auth
    const { senderId, receiverId } = socket.handshake.auth;

    if (!senderId || !receiverId) {
      return next(new Error('Invalid request, missing sender or receiver'));
    }

    // Check if the sender is blocked by the receiver
    const isBlocked = await this.chatService.isBlocked(senderId, receiverId);

    if (isBlocked) {
      return next(new Error('You cannot message this user.'));
    }

    // Allow the connection if not blocked
    next();
  }
}