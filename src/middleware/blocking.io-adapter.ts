import { IoAdapter } from '@nestjs/platform-socket.io';
import { BlockingMiddleware } from './blocking.middleware';
import { ChatService } from '../chat/chat.service';

export class BlockingIoAdapter extends IoAdapter {
  private blockingMiddleware: BlockingMiddleware;

  constructor(app: any, private readonly chatService: ChatService) {
    super(app);
    this.blockingMiddleware = new BlockingMiddleware(chatService);
  }

  create(port: number, options?: any): any {
    const server = super.create(port, options);

    // Apply the middleware to the WebSocket server
    server.use((socket, next) => {
      this.blockingMiddleware.use(socket, next);
    });

    return server;
  }
}