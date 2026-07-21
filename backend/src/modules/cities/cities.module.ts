import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { SupabaseModule } from '../../common/supabase/supabase.module';
import { SupabaseAuthModule } from '../../common/guards/supabase-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Country]),
    SupabaseModule,
    SupabaseAuthModule
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
