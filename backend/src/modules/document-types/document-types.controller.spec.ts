import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTypesController } from './document-types.controller';
import { DocumentTypesService } from './document-types.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('DocumentTypesController', () => {
  let controller: DocumentTypesController;

  const mockDocumentTypesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    toggleActive: jest.fn(),
  }
  
  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      return true; 
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypesController],
      providers: [
        DocumentTypesService,
        { provide: DocumentTypesService, useValue: mockDocumentTypesService },
      ],
    })
    .overrideGuard(SupabaseAuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<DocumentTypesController>(DocumentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
