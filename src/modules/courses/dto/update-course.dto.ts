import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @IsOptional()
    @IsString()
    course_code?: string;

    @IsOptional()
    @IsString()
    course_title?: string;

    @IsOptional()
    @IsString()
    course_type?: string;

    @IsOptional()
    @IsNumber()
    enrolled_students?: number;
}
