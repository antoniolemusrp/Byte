import { IsEmail, IsIn, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";

export class CreateLeadDto {

    @IsString()
    @MinLength(3)
    name: string;
    
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    identification: string;
    
    @IsString()
    phone: string;
    
    @IsIn(['nuevo','contactado','interesado','negociacion','cerrado'])
    @IsOptional()
    stages?: string;
    
    //assignedTo: string;
    @IsUUID()
    sellerId: string;
}
