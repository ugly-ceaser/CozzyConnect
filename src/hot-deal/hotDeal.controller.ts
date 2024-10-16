import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { HotDealService } from "./hotDeal.service"; // Import your HotDealService

@Controller("hotDeal")
export class HotDealController {
    constructor(private readonly hotDealService: HotDealService) {}

    // Get all hot deals based on the user's interest
    @Get('/')
    async GetAll(@Query('userId') userId: string, @Query() query: { page?: number; limit?: number }) {
        return await this.hotDealService.GetAll(userId, query);
    }

    // Filter hot deals based on criteria
    @Get('/filter')
    async filterDeals(@Query() filters: { category?: string; numberOfRooms?: number; state?: string; lga?: string },
                      @Query() query: { page?: number; limit?: number }) {
        return await this.hotDealService.filterDeals(filters, query);
    }

    // Like a specific real estate deal
    @Post('/like')
    async likeDeal(@Body() body: { userId: string; propertyId: number }) {
        const { userId, propertyId } = body;
        return await this.hotDealService.likeDeal(userId, propertyId);
    }

    // Dislike a specific real estate deal
    @Post('/dislike')
    async disLikeDeal(@Body() body: { userId: string; propertyId: number }) {
        const { userId, propertyId } = body;
        return await this.hotDealService.disLikeDeal(userId, propertyId);
    }
}
