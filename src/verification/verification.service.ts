import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserKycDto, UpdateUserKycDto } from '../dto/kycDto';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserKycDto: CreateUserKycDto): Promise<{ data: any, success: boolean }> {
    const { userId, ...rest } = createUserKycDto;

    try {
      // Create KYC record
      const kyc = await this.prisma.userKyc.create({
        data: {
          ...rest,
          user: { connect: { id: userId } },
        },
      });

      // Update user verification status
      await this.prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });

      return { data: kyc, success: true };
    } catch (error) {
      console.error('Error creating KYC record:', error);
      throw new InternalServerErrorException('Failed to create KYC record');
    }
  }

  async findOne(userId: string): Promise<{ data: any, success: boolean }> {
    try {
      console.log('Finding KYC for userId:', userId);
      const userKyc = await this.prisma.userKyc.findUnique({
        where: { userId },
      });

      if (!userKyc) {
        throw new NotFoundException(`UserKyc with userId ${userId} not found`);
      }

      console.log('Found userKyc:', userKyc);
      return { data: userKyc, success: true };
    } catch (error) {
      console.error('Error finding KYC record:', error);
      throw new InternalServerErrorException('Failed to find KYC record');
    }
  }

  async update(userId: string, updateUserKycDto: UpdateUserKycDto): Promise<{ data: any, success: boolean }> {
    try {
      await this.findOne(userId); // Ensure KYC record exists

      const updatedUserKyc = await this.prisma.userKyc.update({
        where: { userId },
        data: updateUserKycDto,
      });

      return { data: updatedUserKyc, success: true };
    } catch (error) {
      console.error('Error updating KYC record:', error);
      throw new InternalServerErrorException('Failed to update KYC record');
    }
  }

  async remove(userId: string): Promise<{ data: any, success: boolean }> {
    try {
      await this.findOne(userId); // Ensure KYC record exists

      const deletedUserKyc = await this.prisma.userKyc.delete({
        where: { userId },
      });

      return { data: deletedUserKyc, success: true };
    } catch (error) {
      console.error('Error deleting KYC record:', error);
      throw new InternalServerErrorException('Failed to delete KYC record');
    }
  }
}
