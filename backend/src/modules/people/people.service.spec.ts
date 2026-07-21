import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { BiostarCredentials } from './entities/biostar-credentials.entity';
import { Person } from './entities/person.entity';
import { PersonDocument } from './entities/person-document.entity';
import { EmployeeLocation } from './entities/employee-location.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PeopleService', () => {
  let service: PeopleService;

  const mockPersonRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockBiostarCredentialsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockPersonDocumentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockEmployeeLocationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockDocumentTypeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockPersonRepository,
        },
        {
          provide: getRepositoryToken(BiostarCredentials),
          useValue: mockBiostarCredentialsRepository,
        },
        {
          provide: getRepositoryToken(PersonDocument),
          useValue: mockPersonDocumentRepository,
        },
        {
          provide: getRepositoryToken(EmployeeLocation),
          useValue: mockEmployeeLocationRepository,
        },
        {
          provide: getRepositoryToken(DocumentType),
          useValue: mockDocumentTypeRepository,
        }
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
