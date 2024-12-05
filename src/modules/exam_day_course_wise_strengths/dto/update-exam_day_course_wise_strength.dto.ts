import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDayStrengthDto } from './create-exam_day_course_wise_strength.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExamDayCourseWiseStrengthDto extends PartialType(CreateExamDayStrengthDto) {
@IsOptional()
@IsString()
examType?: string;

@IsOptional()
@IsNumber()
no_of_students?: number;

@IsOptional()
@IsDate()
@Type(() => Date)
date?: Date;
}
