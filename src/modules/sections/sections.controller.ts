import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('addSection/:id')
  create(@Param('id') id: string, @Body() createSectionDto: CreateSectionDto) {
    console.log(createSectionDto);
    
    return this.sectionsService.createSection(id, createSectionDto);
  }
  @Get('addSection')
  createSection() {
    return this.sectionsService.findSections();
  }

  @Get()
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get('editSection/:id')
  findCoordinatorsAndCourses(@Param('id') id: string) {
    console.log(id);
    
    return this.sectionsService.getCoordinatorsAndCourses(id);
  }

  @Patch('editSection/:id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Get('viewSection/:id')
  viewSection(@Param('id') id: string) {
    
    return this.sectionsService.viewSection(id);
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sectionsService.remove(id);
  // }

  @Delete()
  removeAll(@Query('id') id: string[]) {
    return this.sectionsService.removeAll(id);
  }

  
}
