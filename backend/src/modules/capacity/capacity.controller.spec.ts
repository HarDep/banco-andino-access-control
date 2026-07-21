import { Test, TestingModule } from '@nestjs/testing';
import { CapacityController } from './capacity.controller';
import { CapacityService } from './capacity.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('CapacityController', () => {
  let controller: CapacityController;
  
  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      return true; 
    }),
  };

  const mockCapacityService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update$: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapacityController],
      providers: [
        CapacityService,
        { provide: CapacityService, useValue: mockCapacityService },
      ],
    })
    .overrideGuard(SupabaseAuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<CapacityController>(CapacityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
