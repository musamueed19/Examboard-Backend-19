import { IsNotEmpty, IsString } from "class-validator";

export class CreateExamQuestionDto {
    @IsString()
    @IsNotEmpty()
    examType: string;
}
