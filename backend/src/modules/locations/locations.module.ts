import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './entities/location.entity';
import { City } from '../cities/entities/city.entity';
import { SupabaseModule } from '../../common/supabase/supabase.module';
import { SupabaseAuthModule } from '../../common/guards/supabase-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, City]),
    SupabaseModule,
    SupabaseAuthModule
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
