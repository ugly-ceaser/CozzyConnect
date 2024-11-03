// search-real-estate.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class SearchRealEstateDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    numberOfRooms?: number;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    lga?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    limit: number = 10;
}
