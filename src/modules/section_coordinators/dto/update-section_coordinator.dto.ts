import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionCoordinatorDto } from './create-section_coordinator.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSectionCoordinatorDto extends PartialType(CreateSectionCoordinatorDto) {
    @IsString()
    coordinator: string;
}
