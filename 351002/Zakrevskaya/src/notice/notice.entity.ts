import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from '../article/article.entity';

@Entity({ name: 'tbl_notice' })
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Article, (article) => article.notices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })  // Изменено с articleId на article_id
  article: Article;
}