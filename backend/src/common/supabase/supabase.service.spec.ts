import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { createClient } from '@supabase/supabase-js';

// 1. Mockeamos de forma global el módulo de Supabase
jest.mock('@supabase/supabase-js', () => ({
  // Mantenemos el resto de funcionalidades si existieran
  ...jest.requireActual('@supabase/supabase-js'),
  // Reemplazamos createClient por una función simulada que retorna un cliente vacío
  createClient: jest.fn(() => ({
    from: jest.fn(), // Puedes añadir aquí métodos simulados si tu servicio los usa
    auth: {},
  })),
}));

describe('SupabaseService', () => {
  let service: SupabaseService;

  // 2. Mockeamos el ConfigService para que devuelva strings válidos
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'SUPABASE_URL') return 'https://supabase.co';
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'fake-key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call createClient with correct configuration', () => {
    // 3. Verificamos que al instanciar el servicio se llamó a la función con los parámetros del configService
    expect(createClient).toHaveBeenCalledWith(
      'https://supabase.co',
      'fake-key',
    );
  });

  it('should return the mocked client', () => {
    // 4. Verificamos que getClient devuelva el objeto estructurado en nuestro mock
    const client = service.getClient();
    expect(client).toBeDefined();
    expect(client).toHaveProperty('from');
  });
});
