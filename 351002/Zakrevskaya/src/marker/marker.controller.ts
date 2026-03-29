import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { MarkerService } from './marker.service';
import { CreateMarkerDto } from './dto/marker-request.dto';
import { MarkerResponseDto } from './dto/marker-response.dto';

@Controller('api/v1.0/markers')
export class MarkerController {
  constructor(private readonly markerService: MarkerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMarkerDto: CreateMarkerDto): Promise<MarkerResponseDto> {
    return this.markerService.create(createMarkerDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<MarkerResponseDto[]> {
    return this.markerService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<MarkerResponseDto> {
    return this.markerService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateMarkerDto: CreateMarkerDto): Promise<MarkerResponseDto> {
    return this.markerService.update(id, updateMarkerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    return this.markerService.delete(id);
  }
}