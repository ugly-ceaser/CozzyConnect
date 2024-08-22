import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from '../dto/reviewDto/createReviewDto';
import { UpdateReviewDto } from '../dto/reviewDto/editReviewDto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<{ data: Review | null, success: boolean }> {
    const { realEstateId, rating, comment, propertyPictures } = createReviewDto;

    try {
      const review = await this.prisma.review.create({
        data: {
          userId,
          realEstateId,
          rating,
          comment,
          propertyPictures,
        },
      });
      return { data: review, success: true };
    } catch (error) {
      console.error('Error creating review:', error);
      throw new InternalServerErrorException('Could not create review');
    }
  }

  async update(reviewId: number, userId: string, updateReviewDto: UpdateReviewDto): Promise<{ data: Review | null, success: boolean }> {
    try {
      const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) {
        throw new NotFoundException(`Review with ID ${reviewId} not found`);
      }
      if (review.userId !== userId) {
        throw new ForbiddenException(`You are not allowed to update this review`);
      }
      const updatedReview = await this.prisma.review.update({
        where: { id: reviewId },
        data: {
          rating: updateReviewDto.rating,
          comment: updateReviewDto.comment,
          propertyPictures: updateReviewDto.propertyPictures,
        },
      });
      return { data: updatedReview, success: true };
    } catch (error) {
      console.error('Error updating review:', error);
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not update review');
    }
  }

  async delete(reviewId: number, userId: string): Promise<{ data: Review | null, success: boolean }> {
    try {
      const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) {
        throw new NotFoundException(`Review with ID ${reviewId} not found`);
      }
      if (review.userId !== userId) {
        throw new ForbiddenException(`You are not allowed to delete this review`);
      }
      await this.prisma.review.delete({ where: { id: reviewId } });
      return { data: null, success: true };
    } catch (error) {
      console.error('Error deleting review:', error);
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not delete review');
    }
  }

  async getReviewsForRealEstate(realEstateId: number, page: number = 1, limit: number = 10): Promise<{ data: Review[], total: number, page: number, limit: number, success: boolean }> {
    const offset = (page - 1) * limit;
    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.review.findMany({
          where: { realEstateId },
          skip: offset,
          take: limit,
        }),
        this.prisma.review.count({ where: { realEstateId } }),
      ]);
      return { data, total, page, limit, success: true };
    } catch (error) {
      console.error('Error fetching reviews for real estate:', error);
      throw new InternalServerErrorException('Could not fetch reviews for real estate');
    }
  }
}
