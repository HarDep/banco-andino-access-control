import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('countries')
@UseGuards(SupabaseAuthGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }
}
