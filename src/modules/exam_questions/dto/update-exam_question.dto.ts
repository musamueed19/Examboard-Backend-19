import { PartialType } from '@nestjs/mapped-types';
import { CreateExamQuestionDto } from './create-exam_question.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExamQuestionDto extends PartialType(CreateExamQuestionDto) {
    @IsOptional()
    @IsString()
    examType?: string;

    @IsOptional()
    @IsString()
    marks?: number;
}
