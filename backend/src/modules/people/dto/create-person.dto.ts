import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePersonDocumentDto {
  @IsString()
  documentTypeId: string;

  @IsString()
  numeroDocumento: string;

  @IsBoolean()
  @IsOptional()
  esPrincipal?: boolean;
}

export class CreatePersonLocationDto {
  @IsString()
  locationId: string;

  @IsBoolean()
  @IsOptional()
  esPrincipal?: boolean;
}

export class BiostarCredentialsDto {
  @IsString()
  biostarId: string;

  @IsString()
  tarjetaRfid: string;
}

export class CreatePersonDto {
  @IsEnum(['EMPLEADO', 'VISITANTE', 'CONTRATISTA'])
  tipoPersona: string;

  @IsString()
  primerNombre: string;

  @IsString()
  @IsOptional()
  segundoNombre?: string;

  @IsString()
  primerApellido: string;

  @IsString()
  @IsOptional()
  segundoApellido?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  codigoEmpleado?: string;

  @IsDateString()
  @IsOptional()
  fechaIngreso?: string;

  @IsDateString()
  @IsOptional()
  fechaRetiro?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @IsOptional()
  nivelAcceso?: string;

  @IsString()
  @IsOptional()
  jornada?: string;

  @IsString()
  @IsOptional()
  cargo?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  centroCosto?: string;

  @IsString()
  @IsOptional()
  tipoContrato?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePersonDocumentDto)
  documents: CreatePersonDocumentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePersonLocationDto)
  locations: CreatePersonLocationDto[];
  
  @IsOptional()
  @ValidateNested()
  @Type(() => BiostarCredentialsDto)
  biostarCredentials?: BiostarCredentialsDto;
}
