import { IsUUID, IsOptional } from 'class-validator';

export class PersonQueryDto {
  @IsUUID('4', { message: 'El id de la sede debe ser UUID versión 4 válido.' })
  @IsOptional()
  sedeId?: string;

  @IsOptional()
  active?: boolean

  @IsUUID('4', { message: 'El id del documento debe ser UUID versión 4 válido.' })
  @IsOptional()
  idDocumento?: string
}