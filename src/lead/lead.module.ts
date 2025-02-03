import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { Lead } from './entities/lead.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LeadController],
  providers: [LeadService],
  imports: [TypeOrmModule.forFeature([Lead]) ],
})
export class LeadModule {}
