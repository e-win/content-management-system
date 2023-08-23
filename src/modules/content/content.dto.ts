import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContentDto {
  file?: any;

  @IsString()
  @IsNotEmpty()
  fileName: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
