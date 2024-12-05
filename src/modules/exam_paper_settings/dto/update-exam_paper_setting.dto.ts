import { PartialType } from '@nestjs/mapped-types';
import { CreateExamPaperSettingDto } from './create-exam_paper_setting.dto';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


    export class UpdateExamPaperSettingDto extends PartialType(CreateExamPaperSettingDto) {       
        @IsString()
        @IsNotEmpty()
        exam_type: string;
    
        @IsString()
        @IsNotEmpty()
        course_type: string;
    
        @IsNumber()
        @IsOptional()
        marks?: number;
    
        @IsNumber()
        @IsOptional()
        noOfQuestions?: number; 
    }
    