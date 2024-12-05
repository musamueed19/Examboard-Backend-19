import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  reset_code: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
