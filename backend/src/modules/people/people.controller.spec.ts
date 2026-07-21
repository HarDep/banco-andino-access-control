import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { ExecutionContext } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

describe('PeopleController', () => {
  let controller: PeopleController;

  const mockPeopleService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    toggleActive: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      return true; 
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        PeopleService,
        { provide: PeopleService, useValue: mockPeopleService },
      ],
    })
    .overrideGuard(SupabaseAuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<PeopleController>(PeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
