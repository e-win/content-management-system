import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationParmas {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({})
  @Min(1)
  page: number = 1;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({})
  @Min(1)
  perPage: number = 10;
}

export class PaginatedData<T> {
  constructor(data: T[], metadata: PageMetadataDto) {
    this.data = data;
    this.metadata = metadata;
  }
  data: T[];
  metadata: {
    total: number;
    perPage: number;
    page: number;
  };
}
interface PageMetadataDto {
  total: number;
  perPage: number;
  page: number;
}
