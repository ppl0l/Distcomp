import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../common/repositories/base.repository';
import { Notice } from './notice.entity';

@Injectable()
export class NoticeRepository extends BaseRepository<Notice> {
  constructor(
    @InjectRepository(Notice)
    repository: Repository<Notice>,
  ) {
    super(repository);
  }

  async findByIdWithRelations(id: number): Promise<Notice | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['article'],
    });
  }

  async findAllWithRelations(page: number = 1, limit: number = 10): Promise<[Notice[], number]> {
    const skip = (page - 1) * limit;
    return this.repository.findAndCount({
      relations: ['article'],
      skip,
      take: limit,
    });
  }
}