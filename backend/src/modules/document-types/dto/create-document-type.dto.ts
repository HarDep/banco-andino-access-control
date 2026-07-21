import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDocumentTypeDto {
  @IsString()
  identificador: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsUUID()
  countryId: string;
}
