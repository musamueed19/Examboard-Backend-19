import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExamPaperSettingsService } from './exam_paper_settings.service';
import { CreateExamPaperSettingDto } from './dto/create-exam_paper_setting.dto';
import { UpdateExamPaperSettingDto } from './dto/update-exam_paper_setting.dto';

@Controller('examType')
export class ExamPaperSettingsController {
  constructor(private readonly examPaperSettingsService: ExamPaperSettingsService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createExamPaperSettingDto: CreateExamPaperSettingDto) {
    return this.examPaperSettingsService.create(id, createExamPaperSettingDto);
  }

  @Get(':id')
findAll(@Param('id') id: string, @Query('search') search?: string, @Query('limit') limit?: number, @Query('page') page?: number) {
  return this.examPaperSettingsService.findAllOfSameSemester(id, search, limit, page);
}

  // @Get(':id')
  // viewForUpdate(@Param('id') id: string) {
  //   return this.examPaperSettingsService.viewForUpdate(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamPaperSettingDto: UpdateExamPaperSettingDto) {
    console.log(updateExamPaperSettingDto);
    
    return this.examPaperSettingsService.update(id, updateExamPaperSettingDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.examPaperSettingsService.remove(id);
  // }

  @Delete()
  removeAll(@Query('id') id: string[]) {
  return this.examPaperSettingsService.removeAll(id);
}
  
}

