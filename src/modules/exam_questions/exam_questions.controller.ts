import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ValidationPipe } from '@nestjs/common';
import { ExamQuestionsService } from './exam_questions.service';
import { CreateExamQuestionDto } from './dto/create-exam_question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam_question.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('exam-questions')
export class ExamQuestionsController {
  constructor(private readonly examQuestionsService: ExamQuestionsService) {}

  @Post(':id/addQuestion')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body(new ValidationPipe()) createExamQuestionDto: CreateExamQuestionDto,
  ): Promise<any> {
    return this.examQuestionsService.create(id, file, createExamQuestionDto);
  }

  // @Post()
  // create(@Body() createExamQuestionDto: CreateExamQuestionDto) {
  //   return this.examQuestionsService.create(createExamQuestionDto);
  // }
  @Get('editQuestion')
  editQuestionRequiredInfo() {
    return this.examQuestionsService.editQuestionRequiredInfo();
  }

  @Get()
  findAll() {
    return this.examQuestionsService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examQuestionsService.viewQuestion(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamQuestionDto: UpdateExamQuestionDto) {
    return this.examQuestionsService.update(id, updateExamQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examQuestionsService.remove(id);
  }
}
