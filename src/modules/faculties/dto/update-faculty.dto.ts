import { PartialType } from '@nestjs/mapped-types';
import { CreateFacultyDto } from './create-faculty.dto';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateFacultyDto extends PartialType(CreateFacultyDto) {
      @IsOptional()
      @IsString()
      name?: string;
    
    
      @IsOptional()
      @Length(0, 20, { message: "Contact number is too long" })
      contactNumber?: string;
    
    
      @IsOptional()
      @IsUUID()
      designation_id?: string;
    
      @IsOptional()
      @IsUUID()
      location_id?: string;
    
    
        
}