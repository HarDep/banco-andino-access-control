import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { LocationQueryDto } from './dto/query-params.dto';

@Controller('locations')
@UseGuards(SupabaseAuthGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll(@Query() query: LocationQueryDto) {
    return this.locationsService.findAll(query.cityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }
}
