import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { PersonDocument } from './entities/person-document.entity';
import { EmployeeLocation } from './entities/employee-location.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';
import { PersonMapper } from './mappers/person.mapper';
import { BiostarCredentials } from './entities/biostar-credentials.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(PersonDocument)
    private readonly personDocumentRepository: Repository<PersonDocument>,
    @InjectRepository(EmployeeLocation)
    private readonly employeeLocationRepository: Repository<EmployeeLocation>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(BiostarCredentials)
    private readonly biostarCredentialsRepository: Repository<BiostarCredentials>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    const person = this.personRepository.create({
      ...createPersonDto,
      documents: [],
      locations: [],
    });

    const savedPerson = await this.personRepository.save(person);

    if (createPersonDto.documents?.length) {
      const documentTypes = await this.documentTypeRepository.find({
        where: createPersonDto.documents.map((doc) => ({ id: doc.documentTypeId })),
      });
      const documents = createPersonDto.documents.map((doc) => {
        const documentType = documentTypes.find((item) => item.id === doc.documentTypeId);
        const entity = this.personDocumentRepository.create({
          idDocumento: documentType?.id ?? doc.documentTypeId,
          numeroDocumento: doc.numeroDocumento,
          esPrincipal: doc.esPrincipal ?? false,
          personId: savedPerson.id,
          person: savedPerson,
          documentType,
        });
        return entity;
      });
      await this.personDocumentRepository.save(documents);
    }

    if (createPersonDto.locations?.length) {
      const locations = createPersonDto.locations.map((item) =>
        this.employeeLocationRepository.create({
          employeeId: savedPerson.id,
          locationId: item.locationId,
          esPrincipal: item.esPrincipal ?? false,
          person: savedPerson,
        }),
      );
      await this.employeeLocationRepository.save(locations);
    }

    if (createPersonDto.biostarCredentials) {
      const biostarCredentials = this.biostarCredentialsRepository.create({
        biostarId: createPersonDto.biostarCredentials.biostarId,
        tarjetaRfid: createPersonDto.biostarCredentials.tarjetaRfid,
        estaSincronizado: false,
      });
      await this.biostarCredentialsRepository.save(biostarCredentials);
    }

    return this.findOne(savedPerson.id);
  }

  async findAll(sedeId?: string, active?: boolean, idDocumento?: string) {
    const whereConditions = {};
    if (sedeId) {
      whereConditions['locations'] = { locationId: sedeId };
    }
    if (active !== undefined) {
      whereConditions['activo'] = active;
    }
    if (idDocumento) {
      whereConditions['documents'] = { idDocumento };
    }
    const people = await this.personRepository.find({
      relations: { documents: true, locations: true, biostarCredentials: true } as any,
      order: { primerApellido: 'ASC', primerNombre: 'ASC' },
      where: whereConditions,
    });
    return people.map((person) => PersonMapper.toResponse(person));
  }

  async findOne(id: string) {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: { documents: true, locations: true, biostarCredentials: true } as any,
    });

    if (!person) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`);
    }

    return PersonMapper.toResponse(person);
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.personRepository.preload({
      id,
      ...updatePersonDto,
    });

    if (!person) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`);
    }

    const savedPerson = await this.personRepository.save(person);

    if (updatePersonDto.documents) {
      await this.personDocumentRepository.delete({ personId: id });
      const documents = updatePersonDto.documents.map((doc) =>
        this.personDocumentRepository.create({
          idDocumento: doc.documentTypeId,
          numeroDocumento: doc.numeroDocumento,
          esPrincipal: doc.esPrincipal ?? false,
          personId: savedPerson.id,
          person: savedPerson,
        }),
      );
      await this.personDocumentRepository.save(documents);
    }

    if (updatePersonDto.locations) {
      await this.employeeLocationRepository.delete({ employeeId: id });
      const locations = updatePersonDto.locations.map((item) =>
        this.employeeLocationRepository.create({
          employeeId: savedPerson.id,
          locationId: item.locationId,
          esPrincipal: item.esPrincipal ?? false,
          person: savedPerson,
        }),
      );
      await this.employeeLocationRepository.save(locations);
    }

    if (updatePersonDto.biostarCredentials) {
      const biostarCredentials = await this.biostarCredentialsRepository.findOne({
        where: { empleadoId: id },
      })
      if (biostarCredentials && (biostarCredentials?.biostarId !== updatePersonDto.biostarCredentials.biostarId || 
        biostarCredentials?.tarjetaRfid !== updatePersonDto.biostarCredentials.tarjetaRfid)
      ) {
        await this.biostarCredentialsRepository.update(biostarCredentials.id, {
          biostarId: updatePersonDto.biostarCredentials.biostarId,
          tarjetaRfid: updatePersonDto.biostarCredentials.tarjetaRfid,
          estaSincronizado: false,
        });
      }
    }

    return this.findOne(savedPerson.id);
  }

  async remove(id: string) {
    const person = await this.personRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`);
    }

    await this.personRepository.remove(person);
    return { deleted: true, id };
  }

  async toggleActive(id: string) {
    const person = await this.personRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`);
    }
    person.activo = !person.activo;
    const biostarCredentials = await this.biostarCredentialsRepository.findOne({
      where: { empleadoId: id },
    })
    if (biostarCredentials) {
      biostarCredentials.estaSincronizado = false;
      await this.biostarCredentialsRepository.save(biostarCredentials);
    }
    const saved = await this.personRepository.save(person);
    return PersonMapper.toResponse(saved);
  }
}
