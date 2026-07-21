import { IsUUID, IsOptional } from 'class-validator';

export class DocumentTypeQueryDto {
  @IsUUID('4', { message: 'El id del país debe ser UUID versión 4 válido.' })
  @IsOptional()
  countryId?: string;
}