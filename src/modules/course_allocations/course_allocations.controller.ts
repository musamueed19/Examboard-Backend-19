import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourseAllocationsService } from './course_allocations.service';
import { CreateCourseAllocationDto } from './dto/create-course_allocation.dto';
import { UpdateCourseAllocationDto } from './dto/update-course_allocation.dto';

@Controller('course-allocation')
export class CourseAllocationsController {
  constructor(private readonly courseAllocationsService: CourseAllocationsService) {}

  @Post('allocateCourse/:id')
  create(@Param('id') id: string,@Body() createCourseAllocationDto: CreateCourseAllocationDto) {
    return this.courseAllocationsService.create(id, createCourseAllocationDto);
  }

  @Get()
  findAll() {
    return this.courseAllocationsService.findAll();
  }

  @Get('allocateCourse')
  viewForCreate() {
    return this.courseAllocationsService.viewForCreate();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseAllocationsService.findOne(id);
  }

  @Get('editCourseAllocation/:id')
  viewForUpdate(@Param('id') id: string) {
    return this.courseAllocationsService.viewForUpdate(id);
  }

  @Patch('editCourseAllocation/:id')
  update(@Param('id') id: string, @Body() updateCourseAllocationDto: UpdateCourseAllocationDto) {
    return this.courseAllocationsService.update(id, updateCourseAllocationDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.courseAllocationsService.remove(id);
  // }
  @Delete()
  removeAll(@Query('id') id: string[]) {
    return this.courseAllocationsService.removeAll(id);
  }
}
