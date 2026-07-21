import { Test, TestingModule } from '@nestjs/testing';
import { CapacityService } from './capacity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { EventAccess } from './entities/event-access.entity';
import { I_BIOSTAR_CLIENT_TOKEN } from './interfaces/biostar-client';
import { Person } from '../people/entities/person.entity';

describe('CapacityService', () => {
  let service: CapacityService;

  const mockDeviceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockEvenAccessRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  }

  const biostarClient = {
    login: jest.fn(),
    disableUser: jest.fn(),
    createUser: jest.fn(),
    getEvents: jest.fn(),
  };

  const mockPersonRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CapacityService,
        {
          provide: getRepositoryToken(Device),
          useValue: mockDeviceRepository,
        },
        {
          provide: getRepositoryToken(EventAccess),
          useValue: mockEvenAccessRepository,
        },
        {
          provide: I_BIOSTAR_CLIENT_TOKEN,
          useValue: biostarClient,
        },
        {
          provide: getRepositoryToken(Person),
          useValue: mockPersonRepository,
        }
      ],
    }).compile();

    service = module.get<CapacityService>(CapacityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
