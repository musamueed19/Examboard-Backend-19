import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCourseAllocationDto {
    @IsNotEmpty()
    course: string;

    @IsUUID()
    @IsNotEmpty()
    faculty: string;

    @IsString()
    @IsNotEmpty()
    contribution: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsNumber()
    @IsNotEmpty()
    teacher_share: number;

    @IsNumber()
    @IsNotEmpty()

    allocated_students: number;

    @IsOptional()
    @IsNumber()
    mid_target?: number;

    @IsOptional()
    @IsNumber()
    final_target?: number;

}
