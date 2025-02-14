export interface PropertyType {
  id: number;
  userId: string;
  houseName: string;
  category: string;
  numberOfRooms: number;
  pictures: string[];
  mainPictureIndex: number;
  description: string;
  state: string;
  lga: string;
  nearby: string[];
  amenities: string[];
  address: string;
  createdAt: string;
}

export interface SearchParams {
  category: string;
  numberOfRooms: string;
  state: string;
  lga: string;
  page: number;
  limit: number;
}

export interface PaginatedType {
  total: number;
  page: number;
  limit: number;
}

export interface PropertyTypeData extends PaginatedType {
  data: PropertyType[];
}
