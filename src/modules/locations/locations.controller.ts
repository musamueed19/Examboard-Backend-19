import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async getLocations(
    @Query('search') search: string,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<{ data: Location[]; total: number }> {
    let location;

    location = await this.locationsService.searchLocation(
      search,
      limit,
      page,
    );

    return location;
  }

  @Post('addLocation')
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.locationsService.remove(id);
  }
}
