import { Module, forwardRef } from '@nestjs/common';
import { ExamQuestionsService } from './exam_questions.service';
import { ExamQuestionsController } from './exam_questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestion } from 'src/db/entities/exam_question.entity';
import { SemestersModule } from '../semesters/semesters.module';
import { CoursesModule } from '../courses/courses.module';
import { FacultiesModule } from '../faculties/faculties.module';
import { ExamQuestionAllocationsModule } from '../exam_question_allocations/exam_question_allocations.module';
import { ExamPaperSettingsModule } from '../exam_paper_settings/exam_paper_settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamQuestion]),
    SemestersModule,
    CoursesModule,
    FacultiesModule,
    ExamPaperSettingsModule,
    forwardRef(() => ExamQuestionAllocationsModule),
  ],
  controllers: [ExamQuestionsController],
  providers: [ExamQuestionsService],
  exports: [ExamQuestionsService],
})
export class ExamQuestionsModule {}
