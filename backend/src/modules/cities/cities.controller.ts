import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CityQueryDto } from './dto/query-params.dto';

@Controller('cities')
@UseGuards(SupabaseAuthGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll(@Query() query: CityQueryDto) {
    return this.citiesService.findAll(query.countryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }
}
