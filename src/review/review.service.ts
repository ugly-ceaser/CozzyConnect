import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from '../dto/reviewDto/createReviewDto';
import { UpdateReviewDto } from '../dto/reviewDto/editReviewDto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReviewDto: CreateReviewDto, 
    userId: string
  ): Promise<{ data: Review | null, success: boolean }> {
    const { realEstateId, rating, comment } = createReviewDto;
  
    // Check for existing review
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_realEstateId: {
          userId,
          realEstateId
        }
      }
    });
    
    // If the review exists, update it
    if (existingReview) {
      const updatedReview = await this.prisma.review.update({
        where: {
          userId_realEstateId: {
            userId,
            realEstateId
          }
        },
        data: {
          comment: comment.trim(),
          rating,
        },
      });
      
      return { data: updatedReview, success: true };
    }
  
    // If no existing review, create a new one
    try {
      const newReview = await this.prisma.review.create({
        data: {
          userId,
          realEstateId,
          rating,
          comment: comment.trim(),
        },
      });
      
      return { data: newReview, success: true };
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

  async getReviewsForRealEstate(
    realEstateId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Review[],
    images: string[],
    averageRate: number,
    total: number,
    page: number,
    limit: number,
    success: boolean
  }> {
    const offset = (page - 1) * limit;
  
    try {
      // Fetch reviews and total count in a transaction, excluding sensitive user data
      const [data, total] = await this.prisma.$transaction([
        this.prisma.review.findMany({
          where: { realEstateId },
          skip: offset,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phoneNumber: true,
                isVerified: true,
                isEmailVerified: true,
                isNumberVerified: true,
                country: true,
               
                // Include userInfo fields
                userInfo: {
                  select: {
                    id: true,
                    fullName: true,
                    profilePicture: true,
                    address: true,
                    userType: true,
                    
                  },
                },
              },
            },
          },
        }),
        this.prisma.review.count({ where: { realEstateId } }),
      ]);
  
      // Fetch real estate data (to retrieve the images)
      const realEstateData = await this.prisma.realEstate.findUnique({
        where: { id: realEstateId },
      });
  
      const images = realEstateData?.pictures || []; // Handle if pictures field is empty or null
  
      // Calculate average rating
      const ratings = data.map(x => x.rating);
      let averageRate = 0;
  
      if (ratings.length > 0) {
        const totalRating = ratings.reduce((acc, curr) => acc + curr, 0);
        averageRate = totalRating / ratings.length;
      }
  
      // Return the result with filtered user data
      return { 
        data: data,  // This includes only non-sensitive user and userInfo data
        total: total, 
        page: page,
        limit: limit,
        images: images,
        averageRate: averageRate,
        success: true 
      };
  
    } catch (error) {
      console.error('Error fetching reviews for real estate:', error);
      throw new InternalServerErrorException('Could not fetch reviews for real estate');
    }
  }
  
  
  
  
  
}
