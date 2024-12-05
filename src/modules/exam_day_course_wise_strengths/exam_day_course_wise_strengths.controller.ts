import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ValidationPipe, Query } from '@nestjs/common';
import { ExamDayCourseWiseStrengthsService } from './exam_day_course_wise_strengths.service';
import { UpdateExamDayCourseWiseStrengthDto } from './dto/update-exam_day_course_wise_strength.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateExamDayStrengthDto } from './dto/create-exam_day_course_wise_strength.dto';

@Controller('exam-day-course-wise-strengths')
export class ExamDayCourseWiseStrengthsController {
  constructor(private readonly examDayCourseWiseStrengthsService: ExamDayCourseWiseStrengthsService) {}

  // @Post()
  // create(@Body() createExamDayCourseWiseStrengthDto: CreateExamDayCourseWiseStrengthDto) {
  //   return this.examDayCourseWiseStrengthsService.create(createExamDayCourseWiseStrengthDto);
  // }

  @Get('Add')
  ActiveSemester() {
    return this.examDayCourseWiseStrengthsService.activeSemester();
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: CreateExamDayStrengthDto,
  ): Promise<any> {
    return this.examDayCourseWiseStrengthsService.handleFileUpload(id, file, body);
  }

  @Get()
  findAll() {
    return this.examDayCourseWiseStrengthsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examDayCourseWiseStrengthsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDayCourseWiseStrengthDto: UpdateExamDayCourseWiseStrengthDto) {
    return this.examDayCourseWiseStrengthsService.update(id, updateExamDayCourseWiseStrengthDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.examDayCourseWiseStrengthsService.remove(id);
  }
}
