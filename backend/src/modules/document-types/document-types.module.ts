import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { DocumentType } from './entities/document-type.entity';
import { Country } from '../countries/entities/country.entity';
import { SupabaseModule } from '../../common/supabase/supabase.module';
import { SupabaseAuthModule } from '../../common/guards/supabase-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentType, Country]),
    SupabaseModule,
    SupabaseAuthModule
  ],
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
})
export class DocumentTypesModule {}
