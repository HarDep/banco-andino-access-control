import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CountriesService', () => {
  let service: CountriesService;

  const mockCountryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        }
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
