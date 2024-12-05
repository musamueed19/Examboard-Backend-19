import { Module, forwardRef } from '@nestjs/common';
import { ExamQuestionAllocationsService } from './exam_question_allocations.service';
import { ExamQuestionAllocationsController } from './exam_question_allocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestionAllocation } from 'src/db/entities/exam_question_allocation.entity';
import { FacultiesModule } from '../faculties/faculties.module';
import { ExamQuestionsModule } from '../exam_questions/exam_questions.module';

@Module({
  imports:[ forwardRef(() => ExamQuestionsModule),
    TypeOrmModule.forFeature([ExamQuestionAllocation]), FacultiesModule],
  controllers: [ExamQuestionAllocationsController],
  providers: [ExamQuestionAllocationsService],
  exports: [ExamQuestionAllocationsService]
})
export class ExamQuestionAllocationsModule {}
