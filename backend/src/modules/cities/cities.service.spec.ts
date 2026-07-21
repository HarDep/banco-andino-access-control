import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CitiesService', () => {
  let service: CitiesService;
  
  const mockCityRepository = {
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
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        }
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
