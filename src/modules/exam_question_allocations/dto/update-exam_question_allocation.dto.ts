import { PartialType } from '@nestjs/mapped-types';
import { CreateExamQuestionAllocationDto } from './create-exam_question_allocation.dto';

export class UpdateExamQuestionAllocationDto extends PartialType(CreateExamQuestionAllocationDto) {}
