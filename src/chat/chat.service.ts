import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessage } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, message: string): Promise<ChatMessage> {
    try {
      return await this.prisma.chatMessage.create({
        data: {
          senderId,
          receiverId,
          message,
        },
      });
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }
  }

  async getMessages(): Promise<ChatMessage[]> {
    try {
      // Select all necessary fields
      return await this.prisma.chatMessage.findMany({
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          message: true,
          createdAt: true, // Assuming you have a createdAt field
          isRead: true, // Include isRead field
          isDelivered: true, // Include isDelivered field
        },
      });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      throw new Error('Failed to retrieve messages');
    }
  }
}
