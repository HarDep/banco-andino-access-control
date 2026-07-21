import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { City } from '../cities/entities/city.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LocationsService', () => {
  let service: LocationsService;

  const mockLocationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockCityRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        }
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
