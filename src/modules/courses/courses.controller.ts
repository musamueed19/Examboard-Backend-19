import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from 'src/db/entities/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getCourse(
    @Query('search') search: string,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<{ data: Course[]; total: number }> {
    let course;

    course = await this.coursesService.searchCourse(
      search,
      limit,
      page,
    );

    return course;
  }

  @Post('addCourse')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get('editCourse/:id')
  editCourse(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch('editCourse')
  update(@Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(updateCourseDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.coursesService.remove(id);
  // }

  @Delete()
  removeAll(@Query('id') id: string[]) {
    return this.coursesService.removeAll(id);
  }
}
