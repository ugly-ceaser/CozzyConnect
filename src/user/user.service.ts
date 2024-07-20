import { Injectable, NotFoundException } from '@nestjs/common';
import { userEditDto } from 'src/dto/userDto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: userEditDto) {
    // Check if user exists before attempting to update
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    try {
      // Update user with provided data
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...dto,
        },
      });

      // Remove password before returning user data
      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }
}
