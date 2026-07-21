import { IsUUID, IsOptional } from 'class-validator';

export class LocationQueryDto {
  @IsUUID('4', { message: 'El id de la ciudad debe ser UUID versión 4 válido.' })
  @IsOptional()
  cityId?: string;
}