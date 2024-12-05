import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateSemesterDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @Type(() => Date)
    start_date: Date;

    @IsNotEmpty()
    @Type(() => Date)
    end_date: Date;

    @IsOptional()
    @IsBoolean()
    is_Active?: boolean;

    @IsOptional()
    @Type(() => Date)
    mid_term_date?: Date;

    @IsOptional()
    @Type(() => Date)
    final_term_date?: Date;

    @IsOptional()
    @Type(() => Date)
    mid_term_end_date?: Date;

    @IsOptional()
    @Type(() => Date)
    final_term_end_date?: Date;
}
