import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessage } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, message: string): Promise<{ data: ChatMessage | null; success: boolean }> {
    try {
      const chatMessage = await this.prisma.chatMessage.create({
        data: {
          senderId,
          receiverId,
          message,
        },
      });
      return { data: chatMessage, success: true };
    } catch (error) {
      console.error('Error saving message:', error);
      throw new InternalServerErrorException('Failed to save message');
    }
  }

  async getMessages(): Promise<{ data: ChatMessage[] | null; success: boolean }> {
    try {
      const messages = await this.prisma.chatMessage.findMany({
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
      return { data: messages, success: true };
    } catch (error) {
      console.error('Error retrieving messages:', error);
      throw new InternalServerErrorException('Failed to retrieve messages');
    }
  }
}
