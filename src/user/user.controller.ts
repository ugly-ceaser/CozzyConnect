import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JWTGaurd } from '../auth/gaurd'; // Ensure this is the correct path for your guard
import { CreateUserInfoDto, UpdateUserInfoDto } from '../dto/userDto';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator'; // Ensure this is the correct path for your decorator
import { User } from '@prisma/client';

@UseGuards(JWTGaurd)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Create UserInfo for an existing user
  @Post('/')
  async createUserInfo(@Body() dto: CreateUserInfoDto, @GetUser() user: User) {
    return this.userService.createUserInfo(dto, user.id);
  }

  // Get UserInfo of the currently authenticated user
  @Get('/profile')
  async getProfile(@GetUser() user: User) {
    return this.userService.getUserProfile(user.id);
  }

  // Update UserInfo of the currently authenticated user
  @Patch('/update')
  async updateProfile(@GetUser() user: User, @Body() dto: UpdateUserInfoDto) {
    return this.userService.updateUserProfile(user.id, dto);
  }
}
