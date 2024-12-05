import { IsNotEmpty, IsString, IsInt, IsDateString, IsUUID } from 'class-validator';

export class CreateExamDayStrengthDto {
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  examType: string;

}
