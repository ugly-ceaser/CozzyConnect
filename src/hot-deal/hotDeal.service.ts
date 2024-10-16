import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HotDealService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly MAX_PAGINATION_LIMIT = 100;

  async GetAll(userId: string, { page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    limit = Math.min(limit, this.MAX_PAGINATION_LIMIT);
    const skip = (page - 1) * limit;

    try {
        const userInterest = await this.prisma.realEstateInterest.findUnique({
            where: { userId },
        });

        if (!userInterest) {
            throw new NotFoundException(`No real estate interest found for user ${userId}`);
        }

        const { lga, state, country } = userInterest;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.realEstate.findMany({
                where: {
                    OR: [
                        { lga: { in: lga } },
                        { state: { in: state } },
                        { country: { in: country } },
                    ],
                },
                skip,
                take: limit,
            }),
            this.prisma.realEstate.count({
                where: {
                    OR: [
                        { lga: { in: lga } },
                        { state: { in: state } },
                        { country: { in: country } },
                    ],
                },
            }),
        ]);

        return { data: { items: data, total, page, limit }, success: true };
    } catch (error) {
        console.error('Error fetching hot deals based on user interest:', error);
        throw new InternalServerErrorException('An error occurred while fetching hot deals');
    }
}


  async disLikeDeal(userId: string, propertyId: number) {
    try {
        const realEstate = await this.prisma.realEstate.findUnique({
            where: { id: propertyId },
            include: { user: true },  // Fetch the associated user
        });

        if (!realEstate) {
            throw new NotFoundException(`Real estate property with ID ${propertyId} not found`);
        }

        const userInterest = await this.prisma.realEstateInterest.findUnique({
            where: { userId },
        });

        if (!userInterest) {
            throw new NotFoundException(`No real estate interest found for user ${userId}`);
        }

        // Remove the property from the user's interest, check for user and country
        await this.prisma.realEstateInterest.update({
            where: { userId },
            data: {
                state: { set: userInterest.state.filter(s => s !== realEstate.state) },
                lga: { set: userInterest.lga.filter(l => l !== realEstate.lga) },
                country: { set: userInterest.country.filter(c => c !== realEstate.user?.country) }, // Ensure `country` exists before filtering
            },
        });

        return { success: true, message: 'Deal disliked and removed from user interest' };
    } catch (error) {
        console.error('Error disliking deal:', error);
        throw new InternalServerErrorException('An error occurred while disliking the deal');
    }
}

async likeDeal(userId: string, propertyId: number) {
    try {
        const realEstate = await this.prisma.realEstate.findUnique({
            where: { id: propertyId },
            include: { user: true }, // Fetch the associated user
        });

        if (!realEstate) {
            throw new NotFoundException(`Real estate property with ID ${propertyId} not found`);
        }

        if (!realEstate.user || !realEstate.user.country) {
            throw new NotFoundException(`User or user's country not found for property ${propertyId}`);
        }

        // Add the property details to the user's interest
        await this.prisma.realEstateInterest.update({
            where: { userId },
            data: {
                state: { push: realEstate.state },
                lga: { push: realEstate.lga },
                country: { push: realEstate.user.country },  // Ensure `country` is accessible
            },
        });

        return { success: true, message: 'Deal liked and added to user interest' };
    } catch (error) {
        console.error('Error liking deal:', error);
        throw new InternalServerErrorException('An error occurred while liking the deal');
    }
}

async filterDeals(filter: {
    category?: string;
    numberOfRooms?: number;
    state?: string;
    lga?: string;
}, { page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    limit = Math.min(limit, this.MAX_PAGINATION_LIMIT);
    const skip = (page - 1) * limit;

    try {
        const [data, total] = await this.prisma.$transaction([
            this.prisma.realEstate.findMany({
                where: {
                    ...(filter.category && { category: filter.category }),
                    ...(filter.numberOfRooms && { numberOfRooms: filter.numberOfRooms }),
                    ...(filter.state && { state: filter.state }),
                    ...(filter.lga && { lga: filter.lga }),
                },
                skip,
                take: limit,
            }),
            this.prisma.realEstate.count({
                where: {
                    ...(filter.category && { category: filter.category }),
                    ...(filter.numberOfRooms && { numberOfRooms: filter.numberOfRooms }),
                    ...(filter.state && { state: filter.state }),
                    ...(filter.lga && { lga: filter.lga }),
                },
            }),
        ]);

        return { data: { items: data, total, page, limit }, success: true };
    } catch (error) {
        console.error('Error filtering real estate deals:', error);
        throw new InternalServerErrorException('An error occurred while filtering real estate deals');
    }
}

 
}
