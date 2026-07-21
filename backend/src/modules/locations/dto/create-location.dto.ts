import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  codigoSede: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsUUID()
  cityId: string;

  @IsOptional()
  aforoMaximo?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
