import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { validate as isUUID } from 'uuid';
import { isEmail, IsEmail } from 'class-validator';

@Injectable()
export class LeadService {

  constructor(

    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    
  ) {
  }

  async create(createLeadDto: CreateLeadDto) {
    try{
      const { sellerId, ...leadDetails } = createLeadDto;

      const newLead = this.leadRepository.create({...leadDetails, seller: {id: sellerId}});
      await this.leadRepository.save(newLead);

      return newLead;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {

    const leads = this.leadRepository.find();

    return leads;
  }

  async findOne(term: string) {



    let leadDB: Lead;
    
      if ( isUUID(term) ) {
        leadDB = await this.leadRepository.findOneBy({ id: term });
      } else {
        if (isEmail(term)) { leadDB = await this.leadRepository.findOneBy({ email: term }); }
        else{

          const queryBuilder = this.leadRepository.createQueryBuilder('lead'); 
          leadDB = await queryBuilder
          .where('UPPER(name) =:name or stages =:stages or status =:status', {
            name: term.toUpperCase(),
            stages: term.toLowerCase(),
            status: term.toLowerCase()
          })
          .getOne();
        }
      }

      if (!leadDB) throw new NotFoundException(`Lead id ${term} not found`)

    return leadDB;
  }

  async findMany(term: string) {

    let leadDB: Lead[];

      if ( !term ) {
        leadDB = await this.leadRepository.find();
      if (!leadDB) throw new NotFoundException(`No Lead added yet`)
      return leadDB;
      }
      
    
      if ( isUUID(term) ) {
        leadDB = await this.leadRepository.findBy({ id: term });
        if (leadDB.length === 0) {
          leadDB = await this.leadRepository.findBy({ seller: {id: term }  });}
      } else {
        if (isEmail(term)) { leadDB = await this.leadRepository.findBy({ email: term }); }
        else{

          const queryBuilder = this.leadRepository.createQueryBuilder('lead'); 
          leadDB = await queryBuilder
          .where('UPPER(name) =:name or stages =:stages or status =:status or identification =:identification', {
            name: term.toUpperCase(),
            stages: term.toLowerCase(),
            status: term.toLowerCase(),
            identification: term
          })
          .getMany();
        }
      }

      if (!leadDB) throw new NotFoundException(`Lead id ${term} not found`)

    return leadDB;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {

    const { sellerId, stages,...leadDetails } = updateLeadDto;

    if(stages) {
      const leadDB = await this.findOne(id);

      const validStages = this.validateStages(leadDB.stages, stages);
      
    }

    const lead = await this.leadRepository.preload({
      id: id,
      ...leadDetails,
      stages: stages === 'cerrado' ? 'cliente' : stages,
      seller: {id: sellerId},
      updateAt: Date.now()
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

  private validateStages(prevStages: string, newStages: string) {
    if (prevStages ==='nuevo' && newStages !== 'contactado') 
      throw new BadRequestException('Invalid stage transition');

    if (prevStages ==='contactado' && newStages !== 'interesado') 
      throw new BadRequestException('Invalid stage transition');

    if (prevStages ==='interesado' && newStages !== 'negociacion') 
      throw new BadRequestException('Invalid stage transition');

    if (prevStages ==='negociacion' && newStages !== 'cerrado') 
      throw new BadRequestException('Invalid stage transition');

    if (prevStages ==='cerrado') 
      throw new BadRequestException('Invalid stage transition, lead already closed');

    return true;

  }

}

