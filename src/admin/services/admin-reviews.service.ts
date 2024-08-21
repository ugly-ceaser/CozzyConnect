import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust this import path based on your project structure
import { Review } from '@prisma/client'; // Adjust based on your setup

@Injectable()
export class AdminReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Fetch all reviews with pagination
  async getAllReviews(skip: number = 0, take: number = 10): Promise<Review[]> {
    return this.prisma.review.findMany({
      skip,
      take,
    });
  }

  // Fetch a single review by ID
  async getReviewById(id: number): Promise<Review> { // Use 'string' if 'id' is a String in your model
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  // Delete a review by ID
  async deleteReview(id: number): Promise<Review> { // Use 'string' if 'id' is a String in your model
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
