import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Seller } from './entities/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SellerService {
  constructor(
  
      @InjectRepository(Seller)
      private readonly leadRepository: Repository<Seller>,
      
    ) {
    }
  
    async create(createSellerDto: CreateSellerDto) {
  
      const newLead = this.leadRepository.create(createSellerDto);
        await this.leadRepository.save(newLead);
  
      return newLead;
    }
  
    findAll() {
      return this.leadRepository.find();
    }
  
    async findOne(id: string) {
  
      const brandDB = await this.leadRepository.findOneBy({id});
      if (!brandDB) throw new NotFoundException(`Brand id ${id} not found`)
  
      return brandDB;
    }
  
    async update(id: string, updateSellerDto: UpdateSellerDto) {
  
      const lead = await this.leadRepository.preload({
        id: id,
        ...updateSellerDto
      });
  
      if ( !lead ) throw new NotFoundException(`Product with id: ${ id } not found`);
  
      try {
        await this.leadRepository.save( lead );
        return lead;
        
      } catch (error) {
        this.handleDBExceptions(error);
      }
    }
  
    async remove(id: string) {
  
      const lead = await this.leadRepository.preload({
        id: id,
        status: 'eliminado'
      });
  
      if ( !lead ) throw new NotFoundException(`Product with id: ${ id } not found`);
  
      try {
        await this.leadRepository.save( lead );
        return lead;
        
      } catch (error) {
        this.handleDBExceptions(error);
      }
    }
  
  
    private handleDBExceptions( error: any ) {
  
      if ( error.code === '23505' )
        throw new BadRequestException(error.detail);
      
      // console.log(error)
      throw new InternalServerErrorException('Unexpected error, check server logs');
  
    }
}
