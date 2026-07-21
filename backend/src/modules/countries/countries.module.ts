import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country } from './entities/country.entity';
import { SupabaseModule } from '../../common/supabase/supabase.module';
import { SupabaseAuthModule } from '../../common/guards/supabase-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    SupabaseModule,
    SupabaseAuthModule
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
