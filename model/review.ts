import { PaginatedType } from "./property";

export interface ReviewData {
  realEstateId?: number;
  rating: number;
  comment: string;
  propertyPictures?: string[];
}

export interface ReviewResult {
  id: number;
  userId: string;
  realEstateId: number;
  rating: number;
  comment: string;
  propertyPictures: string[];
  createdAt: string;
  user: {
    id: string;
    email: string;
    phoneNumber: string | null;
    isVerified: boolean;
    isEmailVerified: boolean;
    isNumberVerified: boolean;
    country: string;
    userInfo: {
      id: string;
      fullName: string;
      profilePicture: string;
      address: string;
      userType: string;
    };
  };
}



export interface ReviewResponseData extends PaginatedType {
  data: ReviewData[];
}

export interface ReviewResponse {
  data: [];
  total: number;
  page: number;
  limit: number;
  images: string[];
  averageRate: number;
  success: boolean;
}
