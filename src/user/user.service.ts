import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInfoDto, UpdateUserInfoDto } from '../dto/userDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUserInfo(dto: CreateUserInfoDto, userId: string) {
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

      // Update the user's isVerified field to true
      await this.prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });

      return newUserInfo;
    } catch (error) {
      console.error('Error creating user info:', error);
      throw new BadRequestException('Failed to create user info');
    }
  }


  async getUserProfile(userId: string) {
    // Fetch UserInfo for the existing user
    const userInfo = await this.prisma.userInfo.findUnique({
      where: { userId: userId }, // Fetch UserInfo based on userId
    });

    if (!userInfo) {
      throw new NotFoundException(`UserInfo for user ID ${userId} not found`);
    }

    return userInfo;
  }

  async updateUserProfile(userId: string, dto: UpdateUserInfoDto) {
    // Check if UserInfo exists before attempting to update
    const existingUserInfo = await this.prisma.userInfo.findUnique({
      where: { userId: userId },
    });

    if (!existingUserInfo) {
      throw new NotFoundException(`UserInfo for user ID ${userId} not found`);
    }

    try {
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

      return updatedUserInfo;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new BadRequestException('Failed to update user profile');
    }
  }
}
