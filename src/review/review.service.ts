import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from '../dto/reviewDto/createReviewDto';
import { UpdateReviewDto } from '../dto/reviewDto/editReviewDto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
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

      return review;
    } catch (e) {
      console.error('Error creating review:', e);
      throw new Error('Could not create review');
    }
  }

  async update(reviewId: number, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      });

      if (!review) {
        throw new NotFoundException(`Review with ID ${reviewId} not found`);
      }

      if (review.userId !== userId) {
        throw new ForbiddenException(`You are not allowed to update this review`);
      }

      return await this.prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          rating: updateReviewDto.rating,
          comment: updateReviewDto.comment,
          propertyPictures: updateReviewDto.propertyPictures,
        },
      });
    } catch (e) {
      console.error('Error updating review:', e);
      throw new Error('Could not update review');
    }
  }

  async delete(reviewId: number, userId: string): Promise<Review> {
    try {
      const review = await this.prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      });

      if (!review) {
        throw new NotFoundException(`Review with ID ${reviewId} not found`);
      }

      if (review.userId !== userId) {
        throw new ForbiddenException(`You are not allowed to delete this review`);
      }

      return await this.prisma.review.delete({
        where: {
          id: reviewId,
        },
      });
    } catch (e) {
      console.error('Error deleting review:', e);
      throw new Error('Could not delete review');
    }
  }

  async getReviewsForRealEstate(realEstateId: number, page: number, limit: number): Promise<Review[]> {
    const offset = (page - 1) * limit;
    try {
      return await this.prisma.review.findMany({
        where: {
          realEstateId,
        },
        skip: offset,
        take: limit,
      });
    } catch (e) {
      console.error('Error fetching reviews for real estate:', e);
      throw new Error('Could not fetch reviews for real estate');
    }
  }
}
