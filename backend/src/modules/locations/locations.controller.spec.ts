import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { ExecutionContext } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

describe('LocationsController', () => {
  let controller: LocationsController;

  const mockLocationsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      return true; 
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        LocationsService,
        { provide: LocationsService, useValue: mockLocationsService },
      ],
    })
    .overrideGuard(SupabaseAuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<LocationsController>(LocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
