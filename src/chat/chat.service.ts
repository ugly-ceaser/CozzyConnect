import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, message: string) {
    return await this.prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        message,
        isRead: false,
        isDelivered: false,
        deleteStatus: {} as Record<string, boolean>, // Fix type error
      },
    });
  }
  async getMessages(userId: string, anotherUserId: string) {
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        OR: [
        
          { senderId: userId, receiverId: anotherUserId },
                                                                        
          { senderId: anotherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' }, // Sort messages by creation time
    });
  
    // Filter out messages that the userId has marked as deleted
    return messages.filter((msg) => !(msg.deleteStatus as Record<string, boolean>)?.[userId]);
  }

  async getChatUsers(userId: string) {
    console.log('Fetching chat users for userId:', userId);
  
    try {
      // Step 1: Fetch all chat messages involving the authenticated user
      const chatUsers = await this.prisma.chatMessage.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        select: {
          senderId: true,
          receiverId: true,
        },
      });
  
      // Step 2: Extract unique user IDs (excluding the authenticated user)
      const uniqueUserIds = new Set<string>();
      chatUsers.forEach(({ senderId, receiverId }) => {
        if (senderId !== userId) uniqueUserIds.add(senderId);
        if (receiverId !== userId) uniqueUserIds.add(receiverId);
      });
  
      // Step 3: Fetch profile details and last message for each unique user
      const usersWithDetails = await Promise.all(
        Array.from(uniqueUserIds).map(async (otherUserId) => {
          // Fetch user profile (including UserInfo)
          const userProfile = await this.prisma.user.findUnique({
            where: { id: otherUserId },
            include: {
              userInfo: true, // Include UserInfo details
            },
          });
  
          if (!userProfile) {
            throw new NotFoundException(`User with ID ${otherUserId} not found`);
          }
  
          // Fetch the last message exchanged between the authenticated user and the other user
          const lastMessage = await this.prisma.chatMessage.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId },
              ],
            },
            orderBy: { createdAt: 'desc' }, // Get the most recent message
            select: {
              id: true,
              message: true, // Use the correct field name from the schema
              createdAt: true,
            },
          });
  
          return {
            user_id: otherUserId,
            user_photo: userProfile.userInfo?.profilePicture || null, // Use profilePicture from UserInfo
            user_fullname: userProfile.userInfo?.fullName || null, // Use fullName from UserInfo
            last_message: lastMessage ? [lastMessage] : [], // Return as an array of a single message
          };
        }),
      );
  
      return usersWithDetails;
    } catch (error) {
      console.error('Error fetching chat users:', error);
      throw new Error('Failed to fetch chat users');
    }
  }

  async markAsDelivered(messageId: number) {
    return await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { isDelivered: true },
    });
  }

  async markAsRead(messageId: number) {
    return await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async deleteMessage(userId: string, messageId: number) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Ensure deleteStatus is properly updated
    return await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        deleteStatus: {
          ...(message.deleteStatus as Record<string, boolean>),
          [userId]: true, // Mark as deleted for this user
        },
      },
    });
  }

  async blockUser(userId: string, blockedUserId: string) {
    return await this.prisma.blockedUser.create({
      data: {
        blockerId: userId,
        blockedId: blockedUserId,
      },
    });
  }



  async isBlocked(senderId: string, receiverId: string): Promise<boolean> {
    const blocked = await this.prisma.blockedUser.findFirst({
      where: {
        blockerId: senderId,
        blockedId: receiverId,
      },
    });
    return !!blocked;
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<{ success: boolean; message: string }> {
    const blockEntry = await this.prisma.blockedUser.findFirst({
      where: { blockerId, blockedId },
    });

    if (!blockEntry) {
      return { success: false, message: "User is not blocked." };
    }

    await this.prisma.blockedUser.delete({
      where: { id: blockEntry.id },
    });

    return { success: true, message: "User has been unblocked." };
  }

  async getUserProfile(userId: string): Promise<{ data: any; success: boolean }> {
    try {
      // Step 1: Check if the user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      // Step 2: Fetch UserInfo for the user
      const userInfo = await this.prisma.userInfo.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              phoneNumber: true,
              email: true,
              country: true,
              createdAt: true,
            },
          },
        },
      });
  
      // Step 3: Handle the case where UserInfo is not found
      if (!userInfo) {
        // Return a response indicating that UserInfo is not found
        return {
          data: {
            message: `UserInfo for user ID ${userId} not found`,
            user: {
              id: user.id,
              email: user.email,
              phoneNumber: user.phoneNumber,
              country: user.country,
              createdAt: user.createdAt,
            },
          },
          success: true,
        };
      }
  
      // Step 4: Merge user and userInfo details
      const completeUser = { ...userInfo, ...userInfo.user };
  
      // Step 5: Remove the nested user object after merging
      delete completeUser.user;
  
      // Step 6: Return the merged user data
      return { data: completeUser, success: true };
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching user profile:', error);
  
      // Handle specific errors
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      }
  
      // Throw a generic internal server error for other cases
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }
}
