import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { BlockingMiddleware } from '../middleware/blocking.middleware';

@WebSocketGateway(3002, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Allow fallback to polling
})

export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    new BlockingMiddleware(this.chatService).use(client, (error) => {
      if (error) {
        console.log('Connection blocked:', error.message);
        client.disconnect();
      }
    });

    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    if (client.data?.userId) {
      this.server.emit('userDisconnected', { userId: client.data.userId });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { senderId: string; receiverId: string; message: string }) {
    if (!data.senderId || !data.receiverId || !data.message) {
      return { error: 'Invalid message payload' };
    }

    try {

      const isBlocked = await this.chatService.isBlocked(data.senderId, data.receiverId);
      if (isBlocked) {
        return { error: 'You cannot message this user.' };
      }

      const chatMessage = await this.chatService.saveMessage(data.senderId, data.receiverId, data.message);
      if (!chatMessage) throw new Error('Message save failed');

      // Emit message only if receiver is online
      const receiverSockets = this.server.sockets.adapter.rooms.get(data.receiverId);
      if (receiverSockets && receiverSockets.size > 0) {
        this.server.to(data.receiverId).emit('receiveMessage', chatMessage);
      }

      return { success: true, message: chatMessage };
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Internal Server Error' };
    }
  }

  @SubscribeMessage('markAsDelivered')
  async handleMarkDelivered(@MessageBody() messageId: any) {
    // ✅ Ensure messageId is a valid number
    const id = Number(messageId);
    if (isNaN(id)) {
      return { error: 'Invalid messageId' };
    }

    const feedback = await this.chatService.markAsDelivered(id);
    console.log('Mark As Delivered Feedback:', feedback);
    return feedback;
  }

  @SubscribeMessage('markAsRead')
  async handleMarkRead(@MessageBody() messageId: any) {
    const id = Number(messageId);
    if (isNaN(id)) {
      return { error: 'Invalid messageId' };
    }

    const feedback = await this.chatService.markAsRead(id);
    console.log('Mark As Read Feedback:', feedback);
    return feedback;
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.userId) return { error: 'Invalid userId' };

    client.join(data.userId);
    client.data.userId = data.userId;
    console.log(`User ${data.userId} joined chat`);

    return { message: `User ${data.userId} joined chat` };
  }

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(
    @MessageBody() data: { blockerId: string; blockedId: string },
    @ConnectedSocket() client: Socket
  ) {
    if (!data.blockerId || !data.blockedId) {
      return { error: "Invalid user IDs." };
    }

    const result = await this.chatService.unblockUser(data.blockerId, data.blockedId);
    console.log(`Unblock Result:`, result);

    if (result.success) {
      this.server.to(data.blockedId).emit("userUnblocked", { blockerId: data.blockerId });
    }

    return result;
  }
}
