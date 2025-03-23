import {
  Controller, Get, UseGuards, Patch, Post, Body, Req, Param, Delete
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JWTGaurd } from '../auth/gaurd';
import { Request } from 'express';
import { GetUser } from '../auth/decorator'; 
import { User } from '@prisma/client';

@UseGuards(JWTGaurd)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Fetch messages between authenticated user and another user
  @Get('messages/:receiverId')
  async getMessages(
    @GetUser() user: User,
    @Param('receiverId') receiverId: string,
  ) {
    const userId = user.id;  // Extract authenticated user's ID
    return await this.chatService.getMessages(userId, receiverId);
  }

  // Fetch all users the authenticated user has chatted with
  @Get('allusers')
  async getChatUsers(@GetUser() user: User) {
    const userId = user.id;
    console.log('Controller hit! User ID:', userId);
    return await this.chatService.getChatUsers(userId);
  }

  // Fetch the profile of a specific user
  @Get('singleuser/:userId')
  async getChatUsersProfile(@Param('userId') userId: string) {
    return await this.chatService.getUserProfile(userId);
  }

  // Soft delete a message for the authenticated user
  @Delete('messages/:messageId')
  async deleteMessage(
    @GetUser() user: User,
    @Param('messageId') messageId: string,
  ) {
    const userId = user.id;
    return await this.chatService.deleteMessage(userId, parseInt(messageId));
  }

  // Block a user
  @Patch('users/block/:blockedUserId')
  async blockUser(
    @GetUser() user: User,
    @Param('blockedUserId') blockedUserId: string,
  ) {
    const userId = user.id;
    return await this.chatService.blockUser(userId, blockedUserId);
  }

  // Unblock a user
  @Patch('users/unblock/:blockedUserId')
  async unblockUser(
    @GetUser() user: User,
    @Param('blockedUserId') blockedUserId: string,
  ) {
    const blockerId = user.id;
    return this.chatService.unblockUser(blockerId, blockedUserId);
  }
}