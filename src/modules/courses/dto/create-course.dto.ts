import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    course_code: string;

    @IsString()
    @IsNotEmpty()
    course_title: string;

    @IsString()
    @IsNotEmpty()
    course_type: string;

    @IsNumber()
    @IsNotEmpty()
    enrolled_students: number;
}
