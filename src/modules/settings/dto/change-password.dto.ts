import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class ChangePasswordDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
