import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/article-request.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Controller('api/v1.0/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleResponseDto> {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ArticleResponseDto[]> {
    return this.articleService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<ArticleResponseDto> {
    return this.articleService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateArticleDto: CreateArticleDto): Promise<ArticleResponseDto> {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    return this.articleService.delete(id);
  }
}