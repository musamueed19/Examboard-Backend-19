  import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetCodeDto {
    @IsString()
    reset_code: string;
    
}
