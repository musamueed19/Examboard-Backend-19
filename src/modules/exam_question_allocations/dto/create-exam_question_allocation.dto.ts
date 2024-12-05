import { IsNotEmpty, IsString } from "class-validator";

export class CreateExamQuestionAllocationDto {
    @IsString()
    @IsNotEmpty()
    examType: string;
}
