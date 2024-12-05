import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ValidationPipe } from '@nestjs/common';
import { ExamQuestionAllocationsService } from './exam_question_allocations.service';
import { CreateExamQuestionAllocationDto } from './dto/create-exam_question_allocation.dto';
import { UpdateExamQuestionAllocationDto } from './dto/update-exam_question_allocation.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('exam-question-allocations')
export class ExamQuestionAllocationsController {
  constructor(private readonly examQuestionAllocationsService: ExamQuestionAllocationsService) {}


  @Post(':id/allocateQuestion')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body(new ValidationPipe()) createExamQuestionAllocationDto: CreateExamQuestionAllocationDto,
  ): Promise<any> {
    return this.examQuestionAllocationsService.create(id, file, createExamQuestionAllocationDto);
  }

  // @Post()
  // create(@Body() createExamQuestionAllocationDto: CreateExamQuestionAllocationDto) {
  //   return this.examQuestionAllocationsService.create(createExamQuestionAllocationDto);
  // }

  @Get()
  findAll() {
    return this.examQuestionAllocationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examQuestionAllocationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamQuestionAllocationDto: UpdateExamQuestionAllocationDto) {
    return this.examQuestionAllocationsService.update(+id, updateExamQuestionAllocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examQuestionAllocationsService.remove(+id);
  }
}
