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

      // Update user verification status
      await this.prisma.user.update({
        where: { id: userId },
        data: { hasProfile: true },
      });

      

      return { data: newUserInfo, success: true };
    } catch (error) {
      console.error('Error creating user info:', error);
      throw new InternalServerErrorException('Failed to create user info');
    }
  }

  async getUserProfile(userId: string): Promise<{ data: any, success: boolean }> {
    try {
      // Fetch user info and user details in a single query
      const userInfo = await this.prisma.userInfo.findUnique({
        where: { userId },
        include: {
          user: { // Fetching related user details in the same query
            select: { 
              phoneNumber: true,
              email: true, 
              country: true, 
              createdAt: true 
            },
          },
        },
      });
  
      if (!userInfo) {
        throw new NotFoundException(`UserInfo for user ID ${userId} not found`);
      }
  
      // Merge user and userInfo details
      const completeUser = { ...userInfo, ...userInfo.user };

      //console.log(completeUser)
  
      // Remove nested user object after merging
      delete completeUser.user;

      console.log(completeUser)
  
      return { data: completeUser, success: true };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }
  

  async updateUserProfile(userId: string, dto: UpdateUserInfoDto): Promise<{ data: any, success: boolean }> {
    try {
      // Attempt to update UserInfo, throwing an error if the user doesn't exist
      const updatedUserInfo = await this.prisma.userInfo.update({
        where: { userId },
        data: {
          fullName: dto.fullName,
          profilePicture: dto.profilePicture,
          address: dto.address,
          userType: dto.userType,
        },
        select: { fullName: true, profilePicture: true, address: true, userType: true }, // Select only required fields
      });
  
      let updatedUserData = updatedUserInfo;
  
      // If phone number is provided, update user table as well
      if (dto.phoneNumber) {
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            phoneNumber: dto.phoneNumber,
            isNumberVerified: false,
          },
          select: { phoneNumber: true, isNumberVerified: true },
        });
  
        // Merge user info and updated user fields
        updatedUserData = { ...updatedUserInfo, ...updatedUser };
      }
  
      return { data: updatedUserData, success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }
  
}
