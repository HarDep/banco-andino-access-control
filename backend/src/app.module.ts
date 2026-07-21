import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from './modules/people/people.module';
import { DocumentTypesModule } from './modules/document-types/document-types.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
import { LocationsModule } from './modules/locations/locations.module';
import { SupabaseModule } from './common/supabase/supabase.module';
import { SupabaseAuthModule } from './common/guards  /supabase-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        'backend/.env.local',
        'backend/.env',
        '.env.local',
        '.env',
      ],
      load: [() => ({
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      })],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
    SupabaseModule,
    SupabaseAuthModule,
    PeopleModule,
    DocumentTypesModule,
    CountriesModule,
    CitiesModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
