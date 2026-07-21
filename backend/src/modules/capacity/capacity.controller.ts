import { Controller, Get, Query, Sse, UseGuards } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { CapacityQueryDto } from './dto/query-params.dto';
import { map } from 'rxjs';
import { CapacityMapper } from './mapper/capacity.mapper';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('capacity')
@UseGuards(SupabaseAuthGuard)
export class CapacityController {
  constructor(private readonly capacityService: CapacityService) {}

  @Get()
  findAll(@Query() query: CapacityQueryDto) {
    return this.capacityService.findAll(query);
  }

  @Sse('stream')
  events(@Query() query: CapacityQueryDto) {
    const { locationId } = query;
    return this.capacityService.update$.pipe(
      map(data => 
        locationId ? CapacityMapper.toCapacityFilteredByLocation(data, locationId) : 
        data
      ),
    );
  }
}
