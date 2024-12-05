import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}