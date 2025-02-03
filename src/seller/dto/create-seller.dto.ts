import { IsEmail, IsIn, IsString, MinLength } from "class-validator";

export class CreateSellerDto {

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
        
    
}
