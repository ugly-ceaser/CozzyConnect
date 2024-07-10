import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserKycDto, UpdateUserKycDto } from '../dto/kycDto';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async create(createUserKycDto: CreateUserKycDto) {

    const { userId, ...rest } = createUserKycDto;
    const kyc = this.prisma.userKyc.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
        
      },
    });

    const user = await this.prisma.user.update({
      where:{
        id : userId

        
      },
      data:{
        isVerified : true
      }
    })
  }

  async findOne(userId: string) {
    const userKyc = await this.prisma.userKyc.findUnique({
      where: { userId },
    });
    if (!userKyc) {
      throw new NotFoundException(`UserKyc with userId ${userId} not found`);
    }
    return userKyc;
  }

  async update(userId: string, updateUserKycDto: UpdateUserKycDto) {
    await this.findOne(userId);
    return this.prisma.userKyc.update({
      where: { userId },
      data: {
        ...updateUserKycDto,
      },
    });
  }

  async remove(userId: string) {
    await this.findOne(userId);
    return this.prisma.userKyc.delete({
      where: { userId },
    });
  }
}
