import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { ArticleRepository } from '../article/article.repository';
import { CreateNoticeDto } from './dto/notice-request.dto';
import { NoticeResponseDto } from './dto/notice-response.dto';
import { Notice } from './notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly articleRepository: ArticleRepository,
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<NoticeResponseDto> {
    this.validateNoticeDto(createNoticeDto);
    
    const article = await this.articleRepository.findById(createNoticeDto.articleId);
    if (!article) throw new NotFoundException('Article not found');

    const noticeData = {
      content: createNoticeDto.content,
      article: article,
    };

    const notice = await this.noticeRepository.create(noticeData);
    
    // Загружаем уведомление с отношениями
    const noticeWithRelations = await this.noticeRepository.findByIdWithRelations(notice.id);
    if (!noticeWithRelations) {
      throw new NotFoundException('Notice not found after creation');
    }
    
    return this.toResponseDto(noticeWithRelations);
  }

  async update(id: number, updateNoticeDto: CreateNoticeDto): Promise<NoticeResponseDto> {
    this.validateNoticeDto(updateNoticeDto);
    
    const notice = await this.noticeRepository.findByIdWithRelations(id);
    if (!notice) throw new NotFoundException('Notice not found');

    if (updateNoticeDto.articleId) {
      const article = await this.articleRepository.findById(updateNoticeDto.articleId);
      if (!article) throw new NotFoundException('Article not found');
      notice.article = article;
    }

    notice.content = updateNoticeDto.content;
    
    // Обновляем через репозиторий
    await this.noticeRepository.update(id, {
      content: notice.content,
      article: notice.article,
    });
    
    // Получаем обновленную запись с отношениями
    const updated = await this.noticeRepository.findByIdWithRelations(id);
    if (!updated) throw new NotFoundException('Notice not found after update');
    
    return this.toResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    const notice = await this.noticeRepository.findById(id);
    if (!notice) throw new NotFoundException('Notice not found');
    await this.noticeRepository.delete(id);
  }

  async findById(id: number): Promise<NoticeResponseDto> {
    const notice = await this.noticeRepository.findByIdWithRelations(id);
    if (!notice) throw new NotFoundException('Notice not found');
    return this.toResponseDto(notice);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<NoticeResponseDto[]> {
    const [notices] = await this.noticeRepository.findAllWithRelations(page, limit);
    return notices.map(notice => this.toResponseDto(notice));
  }

  private validateNoticeDto(dto: CreateNoticeDto) {
    if (dto.content.length < 2 || dto.content.length > 2048) {
      throw new BadRequestException('Content must be 2-2048 characters');
    }
  }

  private toResponseDto(notice: Notice): NoticeResponseDto {
    return {
      id: notice.id,
      content: notice.content,
      articleId: notice.article?.id,
    };
  }
}