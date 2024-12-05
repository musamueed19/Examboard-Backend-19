import { IsBoolean, IsEmail, IsString, IsArray, IsUUID, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
 
  @IsOptional()
  @IsBoolean()
  status?: boolean;

 
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true }) 
  role_ids?: string[];
}
