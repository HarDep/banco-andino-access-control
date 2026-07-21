import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { Person } from './entities/person.entity';
import { PersonDocument } from './entities/person-document.entity';
import { EmployeeLocation } from './entities/employee-location.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';
import { Location } from '../locations/entities/location.entity';
import { BiostarCredentials } from './entities/biostar-credentials.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person, PersonDocument, EmployeeLocation, DocumentType, Location, BiostarCredentials]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
