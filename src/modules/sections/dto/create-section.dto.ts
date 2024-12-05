import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateSectionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUUID()
    @IsNotEmpty()
    coordinator_id: string;
}
