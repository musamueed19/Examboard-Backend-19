import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignationDto } from './create-designation.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {
    @IsOptional()
    @IsString()
    designation_title?: string;
}
