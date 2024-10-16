import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRealEstateDto, UpdateRealEstateDto, ReplaceRealEstateImgDto } from '../dto/realEstateDto/index';

@Injectable()
export class RealEstateService {
    constructor(private prisma: PrismaService) {}

    async create(createRealEstateDto: CreateRealEstateDto) {
        try {
            const { userId, ...rest } = createRealEstateDto;

            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            const realEstate = await this.prisma.realEstate.create({
                data: {
                    ...rest,
                    user: { connect: { id: userId } },
                },
            });

            return { data: realEstate, success: true };
        } catch (error) {
            console.error('Error creating real estate:', error);
            throw new InternalServerErrorException('An error occurred while creating the real estate property');
        }
    }

    async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
        try {
            const skip = (page - 1) * limit;
    
            // Fetch paginated real estate data and total count for all properties
            const [data, total] = await this.prisma.$transaction([
                this.prisma.realEstate.findMany({
                    skip,
                    take: limit,
                }),
                this.prisma.realEstate.count(),
            ]);
    
            return {
                data: {
                    items: data,
                    total,
                    page,
                    limit,
                },
                success: true
            };
        } catch (error) {
            console.error('Error fetching real estate properties:', error);
            throw new InternalServerErrorException('An error occurred while retrieving real estate properties');
        }
    }
    

    async findOne(userId: string, propertyId: number) {
        try {
            const realEstate = await this.prisma.realEstate.findFirst({
                where: {
                    id: propertyId,
                    userId,
                },
            });

            if (!realEstate) {
                throw new NotFoundException('Property not found');
            }

            return { data: realEstate, success: true };
        } catch (error) {
            console.error('Error finding real estate:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while retrieving the real estate property');
        }
    }

    async update(userId: string, propertyId: number, updateRealEstateDto: UpdateRealEstateDto) {
        try {
            const realEstate = await this.prisma.realEstate.findFirst({
                where: {
                    id: propertyId,
                    userId,
                },
            });

            if (!realEstate) {
                throw new NotFoundException('Property not found');
            }

            const updatedRealEstate = await this.prisma.realEstate.update({
                where: { id: propertyId },
                data: updateRealEstateDto,
            });

            return { data: updatedRealEstate, success: true };
        } catch (error) {
            console.error('Error updating real estate:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while updating the real estate property');
        }
    }

    async remove(userId: string, propertyId: number) {
        try {
            const realEstate = await this.prisma.realEstate.findFirst({
                where: {
                    id: propertyId,
                    userId,
                },
            });

            if (!realEstate) {
                throw new NotFoundException('Property not found');
            }

            await this.prisma.realEstate.delete({
                where: { id: propertyId },
            });

            return { data: null, success: true };
        } catch (error) {
            console.error('Error deleting real estate:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while deleting the real estate property');
        }
    }

    async replaceImage(userId: string, propertyId: number, replaceImageDto: ReplaceRealEstateImgDto) {
        try {
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

            const updatedRealEstate = await this.prisma.realEstate.update({
                where: { id: propertyId },
                data: { pictures: updatedPictures },
            });

            return { data: updatedRealEstate, success: true };
        } catch (error) {
            console.error('Error replacing real estate image:', error);
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while replacing the real estate image');
        }
    }

    async searchRealEstates(userId: string, { category, numberOfRooms, state, lga, page = 1, limit = 10 }: {
        category?: string;
        numberOfRooms?: number;
        state?: string;
        lga?: string;
        page?: number;
        limit?: number;
    }) {
        try {
            const skip = (page - 1) * limit;

            const searchConditions: any = { userId };

            if (category) searchConditions.category = category;
            if (numberOfRooms) searchConditions.numberOfRooms = numberOfRooms;
            if (state) searchConditions.state = state;
            if (lga) searchConditions.lga = lga;

            const [data, total] = await this.prisma.$transaction([
                this.prisma.realEstate.findMany({
                    where: searchConditions,
                    skip,
                    take: limit,
                }),
                this.prisma.realEstate.count({
                    where: searchConditions,
                }),
            ]);

            return { data: { items: data, total, page, limit }, success: true };
        } catch (error) {
            console.error('Error searching real estate:', error);
            throw new InternalServerErrorException('An error occurred while searching for real estate properties');
        }
    }
      
}
