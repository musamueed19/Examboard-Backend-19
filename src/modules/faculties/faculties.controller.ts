import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { query } from 'express';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) { }
  
  // @Get('search')
  // searchFaculties(@Query('term') term: string) {
  //   console.log(term);

  //   return this.facultiesService.searchFaculties(term);
    
  //   }
  // @Get()
  // async findAll(
  //   @Query('search') search: string,
  //   @Query('limit') limit = 10,
  //   @Query('page') page = 1,
  // ) {
  //   return this.facultiesService.findAll(search, limit, page);
  // }

  @Get()
async findAll(
  @Query('search') search: string,
  @Query('limit') limit = 10,
  @Query('page') page = 1,
): Promise<{ data: any[]; total: number }> {
  return this.facultiesService.findAllWithSearchAndPagination(search, limit, page);
}
  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Get('editFaculty')
  editUserFaculty() {
    return this.facultiesService.updateData();
  }

  @Get('registration')
  registration() {
    return this.facultiesService.registartionData();
  }
  // @Get()
  // findAll() {
  //   return this.facultiesService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultiesService.findOne(id);
  }

  

  @Patch('editFaculty/:id')
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultiesService.update(id, updateFacultyDto);
  }

  @Delete()
  remove(@Query('id') id: string[]) {
    
    return this.facultiesService.removeAll(id);
  }
}
