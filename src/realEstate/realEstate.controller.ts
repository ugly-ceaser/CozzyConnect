import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { JWTGaurd } from '../auth/gaurd';
import {  realEstateService } from './realEstate.service';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { CreateRealEstateDto, UpdateRealEstateDto, ReplaceRealEstateImgDto } from '../dto/realEstateDto/index';

@UseGuards(JWTGaurd)
@Controller('realEstate')
export class RealEstateController {

    constructor(
        private realEstateService: realEstateService
    ){}

    @Post('/')
    createRealEstate(
        @Body() createRealEstateDto: CreateRealEstateDto,
        @GetUser('id') userId: string
    ){
        createRealEstateDto.userId = userId;
        return this.realEstateService.create(createRealEstateDto);
    }
    
    @Get('/')
    async getRealEstate(
        @GetUser('id') userId: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            throw new BadRequestException('Invalid page or limit parameter');
        }

        return await this.realEstateService.findAll(userId, { page, limit });
    }

    @Get(':id')
    getRealEstateById(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number
    ){
        return this.realEstateService.findOne(userId, propertyId);
    }

    @Patch(':id')
    updateRealEstate(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number,
        @Body() updateRealEstateDto: UpdateRealEstateDto
    ){
        return this.realEstateService.update(userId, propertyId, updateRealEstateDto);
    }

    @Delete(':id')
    deleteRealEstate(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number
    ){
        return this.realEstateService.remove(userId, propertyId);
    }

    @Patch(':id/replace-image')
    replaceImage(
        @GetUser('id') userId: string,
        @Param('id', ParseIntPipe) propertyId: number,
        @Body() replaceImageDto: ReplaceRealEstateImgDto
    ){
        return this.realEstateService.replaceImage(userId, propertyId, replaceImageDto);
    }

    // Additional possible controllers can be added here
}
