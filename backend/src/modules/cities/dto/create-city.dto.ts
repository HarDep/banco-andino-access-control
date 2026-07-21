import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCityDto {
  @IsString()
  nombre: string;

  @IsUUID()
  countryId: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
