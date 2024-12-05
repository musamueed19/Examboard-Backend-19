import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionDto } from './create-section.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {
    @IsOptional()
    @IsString()
    coordinator_id?: string;
}
