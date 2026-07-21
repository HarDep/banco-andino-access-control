import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { DocumentType } from './entities/document-type.entity';
import { Country } from '../countries/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType, Country])],
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
})
export class DocumentTypesModule {}
