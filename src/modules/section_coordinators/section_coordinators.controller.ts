import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SectionCoordinatorsService } from './section_coordinators.service';
import { CreateSectionCoordinatorDto } from './dto/create-section_coordinator.dto';
import { UpdateSectionCoordinatorDto } from './dto/update-section_coordinator.dto';

@Controller('section-coordinators')
export class SectionCoordinatorsController {
  constructor(private readonly sectionCoordinatorsService: SectionCoordinatorsService) {}

  @Post()
  create(@Body() createSectionCoordinatorDto: CreateSectionCoordinatorDto) {
    return this.sectionCoordinatorsService.create(createSectionCoordinatorDto);
  }

  @Get()
  findAll() {
    return this.sectionCoordinatorsService.findAll();
  }

  @Get(':id')
  findCoordinators(@Param('id') id: string[]) {
    return this.sectionCoordinatorsService.findCoordinators(id);
  }

  // @Get(':id')
  // lookCoordinatorsToUpdate(@Param('id') id: string) {
  //   return this.sectionCoordinatorsService.lookCoordinators(id);
  // }
  @Patch()
  update(@Query('id') id: string[], @Body() updateSectionCoordinatorDto: UpdateSectionCoordinatorDto) {
    return this.sectionCoordinatorsService.update(id, updateSectionCoordinatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionCoordinatorsService.remove(+id);
  }
}
