import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {

    @IsIn(['activo','eliminado','inactivo'])
    @IsOptional()
    status?: string;
}
