import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Seller } from './entities/seller.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SellerController],
  providers: [SellerService],
  imports: [TypeOrmModule.forFeature([Seller])],
})
export class SellerModule {}
