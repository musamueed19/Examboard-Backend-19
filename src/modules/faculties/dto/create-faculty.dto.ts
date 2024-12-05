import { IsString, IsUUID, IsEmail, IsNumber, IsNotEmpty, Length, IsBoolean, IsArray } from 'class-validator';

export class CreateFacultyDto {

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
