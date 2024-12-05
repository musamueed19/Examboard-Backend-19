import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class QuestionSetting {
    @IsNumber()
    @IsNotEmpty()
    marks: number;

    @IsNumber()
    @IsNotEmpty()
    noOfQuestions: number;
}

export class CreateExamPaperSettingDto {
   
    @IsString()
    @IsNotEmpty()
    exam_type: string;

    @IsString()
    @IsNotEmpty()
    course_type: string;


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionSetting)
    questions: QuestionSetting[]; 
}
