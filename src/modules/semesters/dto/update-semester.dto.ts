import { PartialType } from '@nestjs/mapped-types';
import { CreateSemesterDto } from './create-semester.dto';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateSemesterDto extends PartialType(CreateSemesterDto) {
    
    @IsDate()
    start_date?: Date;

    @IsDate()
    end_date?: Date;

    @IsOptional()
    @IsBoolean()
    is_Active?: boolean;

    @IsOptional()
    @IsDate()
    mid_term_date?: Date;

    @IsOptional()
    @IsDate()
    final_term_date?: Date;

    @IsOptional()
    @IsDate()
    mid_term_end_date?: Date;

    @IsOptional()
    @IsDate()
    final_term_end_date?: Date;
}
