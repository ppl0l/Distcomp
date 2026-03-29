import { IsString, Length, IsOptional, IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @IsString()
  @Length(2, 64)
  title: string;

  @IsString()
  @Length(4, 2048)
  content: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  markers?: string[];  // Изменено с markerIds на markers, и тип string[]
}