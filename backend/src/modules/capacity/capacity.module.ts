import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { CapacityController } from './capacity.controller';
import { BiostarMockClient } from './biostar-mock-client';
import { I_BIOSTAR_CLIENT_TOKEN } from './interfaces/biostar-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { EventAccess } from './entities/event-access.entity';
import { Location } from '../locations/entities/location.entity';
import { Person } from '../people/entities/person.entity';
import { SupabaseModule } from '../../common/supabase/supabase.module';
import { SupabaseAuthModule } from '../../common/guards/supabase-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, EventAccess, Location, Person]),
    SupabaseModule,
    SupabaseAuthModule
  ],
  controllers: [CapacityController],
  providers: [
    CapacityService,
    {
      provide: I_BIOSTAR_CLIENT_TOKEN,
      useClass: BiostarMockClient,
    },
  ],
  exports: [I_BIOSTAR_CLIENT_TOKEN],
})
export class CapacityModule {}
