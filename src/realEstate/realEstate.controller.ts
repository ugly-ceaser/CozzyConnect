import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { JWTGaurd } from '../auth/gaurd';
import { RealEstateService } from './realEstate.service';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { CreateRealEstateDto, UpdateRealEstateDto, ReplaceRealEstateImgDto } from '../dto/realEstateDto/index';

@UseGuards(JWTGaurd)
@Controller('realEstate')
export class RealEstateController {
    constructor(
        private readonly realEstateService: RealEstateService
    ) {}

    @Post('/')
    async createRealEstate(
        @Body() createRealEstateDto: CreateRealEstateDto,
        @GetUser('id') userId: string
    ) {
        createRealEstateDto.userId = userId;
        return this.realEstateService.create(createRealEstateDto);
    }
    
    @Get('/')
    async getRealEstate(
        @GetUser('id') userId: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        if (page <= 0 || limit <= 0) {
            throw new BadRequestException('Page and limit must be positive numbers');
        }
        return await this.realEstateService.findAll({ page, limit });
    }

    @Get(':id')
    async getRealEstateById(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number
    ) {
        return this.realEstateService.findOne(userId, propertyId);
    }

    @Patch(':id')
    async updateRealEstate(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number,
        @Body() updateRealEstateDto: UpdateRealEstateDto
    ) {
        return this.realEstateService.update(userId, propertyId, updateRealEstateDto);
    }

    @Delete(':id')
    async deleteRealEstate(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number
    ) {
        return this.realEstateService.remove(userId, propertyId);
    }

    @Patch(':id/replace-image')
    async replaceImage(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number,
        @Body() replaceImageDto: ReplaceRealEstateImgDto
    ) {
        return this.realEstateService.replaceImage(userId, propertyId, replaceImageDto);
    }

    @Get('/search')
    async searchRealEstate(
        @GetUser('id') userId: string,
        @Query('category') category?: string,
        @Query('numberOfRooms', ParseIntPipe) numberOfRooms?: number,
        @Query('state') state?: string,
        @Query('lga') lga?: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10
    ) {
        if (page <= 0 || limit <= 0) {
            throw new BadRequestException('Page and limit must be positive numbers');
        }
        return this.realEstateService.searchRealEstates(userId, { category, numberOfRooms, state, lga, page, limit });
    }
}
