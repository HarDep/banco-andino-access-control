import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTypesService } from './document-types.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentType } from './entities/document-type.entity';
import { Country } from '../countries/entities/country.entity';

describe('DocumentTypesService', () => {
  let service: DocumentTypesService;

  const mockDocumentTypeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockCountryRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypesService,
        {
          provide: getRepositoryToken(DocumentType),
          useValue: mockDocumentTypeRepository,
        },
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentTypesService>(DocumentTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
