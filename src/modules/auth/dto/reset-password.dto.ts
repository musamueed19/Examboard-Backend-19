import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;
}
