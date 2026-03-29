import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { MarkerModule } from './marker/marker.module';
import { NoticeModule } from './notice/notice.module';
import { User } from './user/user.entity';
import { Article } from './article/article.entity';
import { Marker } from './marker/marker.entity';
import { Notice } from './notice/notice.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'distcomp',
      entities: [User, Article, Marker, Notice],
      synchronize: true,  // Включите для создания таблиц
      logging: true,
    }),
    UserModule,
    ArticleModule,
    MarkerModule,
    NoticeModule,
  ],
})
export class AppModule {}