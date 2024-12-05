import { IsBoolean, IsEmail, IsString, IsArray, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(0, 20, { message: "Contact number is too long" })
  contactNumber: string;

  @IsBoolean()
  status: boolean;

  @IsUUID() 
  designation_id: string;

  @IsUUID() 
  location_id: string;

  @IsArray()
  @IsUUID(undefined, { each: true }) 
  role_ids: string[];
}
