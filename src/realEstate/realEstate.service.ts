import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRealEstateDto, UpdateRealEstateDto, ReplaceRealEstateImgDto } from '../dto/realEstateDto/index';

@Injectable()
export class RealEstateService {
    constructor(private prisma: PrismaService) {}

    async create(createRealEstateDto: CreateRealEstateDto) {
        const { userId, ...rest } = createRealEstateDto;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return this.prisma.realEstate.create({
            data: {
                ...rest,
                user: { connect: { id: userId } },
            },
        });
    }

    async findAll(userId: string, { page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.prisma.$transaction([
            this.prisma.realEstate.findMany({
                where: { userId },
                skip,
                take: limit,
            }),
            this.prisma.realEstate.count({
                where: { userId },
            }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(userId: string, propertyId: number) {
        const realEstate = await this.prisma.realEstate.findFirst({
            where: {
                id: propertyId,
                userId,
            },
        });

        if (!realEstate) {
            throw new NotFoundException('Property not found');
        }

        return realEstate;
    }

    async update(userId: string, propertyId: number, updateRealEstateDto: UpdateRealEstateDto) {
        const realEstate = await this.prisma.realEstate.findFirst({
            where: {
                id: propertyId,
                userId,
            },
        });

        if (!realEstate) {
            throw new NotFoundException('Property not found');
        }

        return this.prisma.realEstate.update({
            where: { id: propertyId },
            data: updateRealEstateDto,
        });
    }

    async remove(userId: string, propertyId: number) {
        const realEstate = await this.prisma.realEstate.findFirst({
            where: {
                id: propertyId,
                userId,
            },
        });

        if (!realEstate) {
            throw new NotFoundException('Property not found');
        }

        return this.prisma.realEstate.delete({
            where: { id: propertyId },
        });
    }

    async replaceImage(userId: string, propertyId: number, replaceImageDto: ReplaceRealEstateImgDto) {
        const realEstate = await this.prisma.realEstate.findFirst({
            where: {
                id: propertyId,
                userId,
            },
        });
    
        if (!realEstate) {
            throw new NotFoundException('Property not found');
        }
    
        if (replaceImageDto.imageIndex < 0 || replaceImageDto.imageIndex >= realEstate.pictures.length) {
            throw new ForbiddenException('Image index out of bounds');
        }
    
        const updatedPictures = realEstate.pictures.map((picture, index) =>
            index === replaceImageDto.imageIndex ? replaceImageDto.newImageUrl : picture
        );
    
        return this.prisma.realEstate.update({
            where: { id: propertyId },
            data: { pictures: updatedPictures },
        });
    }
    
}
