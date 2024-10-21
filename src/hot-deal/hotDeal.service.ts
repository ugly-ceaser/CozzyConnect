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
        // Check if the user has any real estate interest
        const userInterest = await this.prisma.realEstateInterest.findUnique({
            where: { userId },
        });

        // If no interest is found, return all properties
        if (!userInterest) {
            const [data, total] = await this.prisma.$transaction([
                this.prisma.realEstate.findMany({
                    skip,
                    take: limit,
                }),
                this.prisma.realEstate.count(),
            ]);

            return { data: { items: data, total, page, limit }, success: true };
        }

        // If user interest exists, filter properties based on interests
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
        console.error('Error fetching real estate:', error);
        throw new InternalServerErrorException('An error occurred while fetching real estate');
    }
}



async disLikeDeal(userId: string, propertyId: number) {
    try {
        const realEstate = await this.prisma.realEstate.findUnique({
            where: { id: propertyId },
            include: { user: true }, // Fetch the associated user
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

        // Remove property details from the user's interest
        await this.prisma.realEstateInterest.update({
            where: { userId },
            data: {
                state: { set: userInterest.state.filter(s => s !== realEstate.state) },
                lga: { set: userInterest.lga.filter(l => l !== realEstate.lga) },
                country: { set: userInterest.country.filter(c => c !== realEstate.user?.country) }, // Ensure country is removed
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

        // Fetch the current user interests
        let userInterest = await this.prisma.realEstateInterest.findUnique({
            where: { userId },
        });

        // If no interests found, create a new record
        if (!userInterest) {
            userInterest = await this.prisma.realEstateInterest.create({
                data: {
                    userId,
                    state: [realEstate.state],
                    lga: [realEstate.lga],
                    country: [realEstate.user.country],
                },
            });
        } else {
            // Add property details to the user's interest, avoiding duplicates
            await this.prisma.realEstateInterest.update({
                where: { userId },
                data: {
                    state: { set: Array.from(new Set([...userInterest.state, realEstate.state])) },
                    lga: { set: Array.from(new Set([...userInterest.lga, realEstate.lga])) },
                    country: { set: Array.from(new Set([...userInterest.country, realEstate.user.country])) }, // Avoid duplicate countries
                },
            });
        }

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
