// src/chat/chat.gateway.ts
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
      // Client is already authenticated
      console.log(`Client connected: ${client.id}`);
    }
  
    async handleDisconnect(client: Socket) {
      // Handle disconnection
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('message')
    async handleMessage(
      @MessageBody() data: { receiverId: string; message: string },
      @ConnectedSocket() client: Socket,
    ) {
      const senderId = client.data.user.userId;
      const chatMessage = await this.chatService.saveMessage(senderId, data.receiverId, data.message);
      this.server.emit('message', chatMessage);
    }
  }
  