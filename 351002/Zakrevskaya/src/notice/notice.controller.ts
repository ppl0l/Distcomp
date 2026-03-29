import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/notice-request.dto';
import { NoticeResponseDto } from './dto/notice-response.dto';

@Controller('api/v1.0/notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNoticeDto: CreateNoticeDto): Promise<NoticeResponseDto> {
    return this.noticeService.create(createNoticeDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<NoticeResponseDto[]> {
    return this.noticeService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<NoticeResponseDto> {
    return this.noticeService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateNoticeDto: CreateNoticeDto): Promise<NoticeResponseDto> {
    return this.noticeService.update(id, updateNoticeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    return this.noticeService.delete(id);
  }
}