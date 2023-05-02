import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDTO {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsDateString()
    @IsNotEmpty()
    createdAt!: string;
}