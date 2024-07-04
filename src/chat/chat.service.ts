// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessage } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, message: string): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        message,
      },
    });
  }

  async getMessages(): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany();
  }
}
