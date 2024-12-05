import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/, {
    message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character',
  })
  password: string;
}
