import { IsUUID, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CapacityQueryDto {
    @IsOptional()
  @IsUUID('4', { message: 'El id de la sede debe ser UUID versión 4 válido.' })
  locationId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(['day', 'month', 'range'])
  tipo?: 'day' | 'month' | 'range';
}