import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('CountriesController', () => {
  let controller: CountriesController;

  const mockCountriesService = {
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
      controllers: [CountriesController],
      providers: [
        CountriesService,
        { provide: CountriesService, useValue: mockCountriesService },
      ],
    })
    .overrideGuard(SupabaseAuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<CountriesController>(CountriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
