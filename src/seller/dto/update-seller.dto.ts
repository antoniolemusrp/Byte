import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerDto } from './create-seller.dto';
import { IsIn } from 'class-validator';

export class UpdateSellerDto extends PartialType(CreateSellerDto) {

    @IsIn(['activo','eliminado'])
    status: string;
}
