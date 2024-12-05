import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRoleDto } from './create-user_role.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {
    
    @IsOptional()
    @IsDate()
    start_data?: Date;

    @IsOptional()
    @IsDate()
    end_data?: Date;

    @IsOptional()
    @IsDate()
    mid_term_data?: Date;

    @IsOptional()
    @IsDate()
    final_term_data?: Date;

}
