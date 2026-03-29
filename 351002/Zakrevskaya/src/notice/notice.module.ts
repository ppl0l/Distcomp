import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { NoticeRepository } from './notice.repository';
import { Notice } from './notice.entity';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice]),
    ArticleModule,
  ],
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository],
  exports: [NoticeRepository],
})
export class NoticeModule {}