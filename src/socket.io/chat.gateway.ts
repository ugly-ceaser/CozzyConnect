import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    // Add authentication check here if needed
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { receiverId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data?.user?.userId;

    if (!senderId) {
      client.emit('error', 'User not authenticated');
      return;
    }

    try {
      const chatMessage = await this.chatService.saveMessage(senderId, data.receiverId, data.message);
      this.server.emit('message', chatMessage);
    } catch (error) {
      console.error('Error handling message:', error);
      client.emit('error', 'Failed to send message');
    }
  }
}
