import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkerController } from './marker.controller';
import { MarkerService } from './marker.service';
import { MarkerRepository } from './marker.repository';
import { Marker } from './marker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marker])],
  controllers: [MarkerController],
  providers: [MarkerService, MarkerRepository],
  exports: [MarkerRepository],
})
export class MarkerModule {}