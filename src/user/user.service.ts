import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInfoDto, UpdateUserInfoDto } from '../dto/userDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUserInfo(dto: CreateUserInfoDto, userId: string): Promise<{ data: any, success: boolean }> {
    try {
      // Ensure the user exists
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Create UserInfo for the existing user
      const newUserInfo = await this.prisma.userInfo.create({
        data: {
          fullName: dto.fullName,
          profilePicture: dto.profilePicture,
          address: dto.address,
          userType: dto.userType,
          userId: userExists.id,
        },
      });

      

      return { data: newUserInfo, success: true };
    } catch (error) {
      console.error('Error creating user info:', error);
      throw new InternalServerErrorException('Failed to create user info');
    }
  }

  async getUserProfile(userId: string): Promise<{ data: any, success: boolean }> {
    try {
      // Fetch UserInfo for the existing user
      const userInfo = await this.prisma.userInfo.findUnique({
        where: { userId: userId }, // Fetch UserInfo based on userId
      });

      if (!userInfo) {
        throw new NotFoundException(`UserInfo for user ID ${userId} not found`);
      }

      return { data: userInfo, success: true };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }

  async updateUserProfile(userId: string, dto: UpdateUserInfoDto): Promise<{ data: any, success: boolean }> {
    try {
      // Check if UserInfo exists before attempting to update
      const existingUserInfo = await this.prisma.userInfo.findUnique({
        where: { userId: userId },
      });

      if (!existingUserInfo) {
        throw new NotFoundException(`UserInfo for user ID ${userId} not found`);
      }

      // Update UserInfo with provided data
      const updatedUserInfo = await this.prisma.userInfo.update({
        where: { userId: userId },
        data: {
          fullName: dto.fullName,
          profilePicture: dto.profilePicture,
          address: dto.address,
          userType: dto.userType,
        },
      });

      return { data: updatedUserInfo, success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }
}
