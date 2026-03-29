export class ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  created: string;
  modified: string;
  userId: number;
  markerIds?: number[];  // Оставляем как есть - это для ответа
}