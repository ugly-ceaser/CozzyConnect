import { Controller, Get, Post, Body, Query, UseGuards, BadRequestException, ParseIntPipe } from "@nestjs/common";
import { HotDealService } from "./hotDeal.service"; 
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JWTGaurd } from '../auth/gaurd';

@UseGuards(JWTGaurd)
@Controller("hotDeal")
export class HotDealController {
    constructor(private readonly hotDealService: HotDealService) {}

    // Get all hot deals based on the user's interest
    @Get('/all')  // Suggesting to change from '/' to '/all' for clarity
    async GetAll(@GetUser('id') userId: string, @Query() query: { page?: number; limit?: number }) {
        return await this.hotDealService.GetAll(userId, query);
    }


    @Get('/filter')
    async filterDeals(
        @Query('category') category?: string,
        @Query('numberOfRooms', ParseIntPipe) numberOfRooms?: number, // Parse to integer
        @Query('state') state?: string,
        @Query('lga') lga?: string,
        @Query('page', ParseIntPipe) page: number = 1, // Default page to 1
        @Query('limit', ParseIntPipe) limit: number = 10 // Default limit to 10
    ) {
        const filters = { category, numberOfRooms, state, lga };
        const pagination = { page, limit };

        return await this.hotDealService.filterDeals(filters, pagination);
    }


    // Like a specific real estate deal
    @Post('/like')
    async likeDeal(@Body() body: { propertyId: number }, @GetUser('id') userId: string) {
        const { propertyId } = body;
        if (!propertyId) {
            throw new BadRequestException('Property ID is required');
        }
        return await this.hotDealService.likeDeal(userId, propertyId);
    }

    // Dislike a specific real estate deal
    @Post('/dislike')
    async disLikeDeal(@Body() body: { propertyId: number }, @GetUser('id') userId: string) {
        const { propertyId } = body;
        if (!propertyId) {
            throw new BadRequestException('Property ID is required');
        }
        return await this.hotDealService.disLikeDeal(userId, propertyId);
    }
}
