import { Controller, Get, Param, Post, Patch, Delete, Body, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { JWTGaurd } from '../auth/gaurd';
import { ReviewService } from './review.service';
import { CreateReviewDto } from '../dto/reviewDto/createReviewDto';
import { UpdateReviewDto } from '../dto/reviewDto/editReviewDto';
import { GetUser } from '../auth/decorator/get-user-decorator';

@UseGuards(JWTGaurd)
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto, @GetUser('id') userId: string) {
    return this.reviewService.create(createReviewDto, userId);
  }

  @Patch(':id')
  updateReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @GetUser('id') userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(reviewId, userId, updateReviewDto);
  }

  @Delete(':id')
  deleteReview(@Param('id', ParseIntPipe) reviewId: number, @GetUser('id') userId: string) {
    return this.reviewService.delete(reviewId, userId);
  }

  @Get('real-estate/:id')
  getReviewsForRealEstate(
    @Param('id', ParseIntPipe) realEstateId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new BadRequestException('Invalid page or limit parameter');
    }
    return this.reviewService.getReviewsForRealEstate(realEstateId, page, limit);
  }
}
