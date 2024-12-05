import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseAllocationDto } from './create-course_allocation.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCourseAllocationDto extends PartialType(CreateCourseAllocationDto) {
    @IsOptional()
    @IsString()
    course?: string;

    @IsOptional()
    @IsString()
    faculty?: string;

    @IsOptional()
    @IsString()
    contribution?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsNumber()
    teacher_share?: number;

    @IsOptional()
    @IsNumber()
    allocated_students?: number;

    @IsOptional()
    @IsNumber()
    mid_target?: number;

    @IsOptional()
    @IsNumber()
    final_target?: number;
}
