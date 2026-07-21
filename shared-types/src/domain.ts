export interface CountryRecord {
    id: string;
    nombre: string;
    activo: boolean;
    
}

export interface CityRecord {
  id: string;
  nombre: string;
  activo: boolean;
  countryId: string;
  country?: CountryRecord;
}

export interface LocationRecord {
  id: string;
  codigoSede: string;
  nombre: string;
  direccion?: string;
  cityId: string;
  aforoMaximo?: number;
  activo: boolean;
  city?: CityRecord;
}

export interface DocumentTypeRecord {
  id: string;
  identificador: string;
  descripcion?: string;
  activo: boolean;
  countryId: string;
  country?: CountryRecord;
}

export interface CreateDocumentTypeDto {
  identificador: string;
  descripcion?: string;
  activo?: boolean;
  countryId: string;
}

export type UpdateDocumentTypeDto = Partial<CreateDocumentTypeDto>;

export interface PersonRecord {
  id: string;
  tipoPersona: 'EMPLEADO' | 'VISITANTE' | 'CONTRATISTA';
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  email: string;
  codigoEmpleado: string;
  fechaIngreso: Date;
  fechaRetiro: Date;
  activo: boolean;
  nivelAcceso: string;
  jornada: string;
  cargo: string;
  area: string;
  centroCosto: string;
  tipoContrato: string;
  credencialesBiostar?: {
    id: string;
    biostarId: string;
    tarjetaRfid: string;
    estaSincronizado: boolean;
  };
  documents: {
    idDocumento: string;
    numeroDocumento: string;
    esPrincipal: boolean;
    documentType: {
      id: string;
      identificador: string;
      descripcion: string;
      activo: boolean;
      country: {
        id: string;
        nombre: string;
        activo: boolean;
      };
    };
  }[];
  locations: {
    locationId: string;
    esPrincipal: boolean;
    location: {
      id: string;
      codigoSede: string;
      nombre: string;
      direccion: string;
      activo: boolean;
    };
  }[];
}

export interface CreatePersonRecord {
  tipoPersona: 'EMPLEADO' | 'VISITANTE' | 'CONTRATISTA';
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  email: string;
  codigoEmpleado: string;
  fechaIngreso: Date;
  fechaRetiro: Date;
  activo: boolean;
  nivelAcceso: string;
  jornada: string;
  cargo: string;
  area: string;
  centroCosto: string;
  tipoContrato: string;
  credencialesBiostar: {
    biostarId: string;
    tarjetaRfid: string;
  };
  documents: {
    documentTypeId: string;
    numeroDocumento: string;
    esPrincipal: boolean;
  }[];
  locations: {
    locationId: string;
    esPrincipal: boolean;
  }[];
}

export type UpdatePersonRecord = Partial<CreatePersonRecord>;

export interface EventAccessRecord {
  personId: string;
  locationId: string;
  timestamp: string;
  tipo: 'ENTRADA' | 'SALIDA';
  person: PersonRecord;
  sede: LocationRecord;
}

export interface CapacityResultRecord {
  eventos: EventAccessRecord[];
  aforoPorSede?: {
    sede: LocationRecord;
    totalIngresos: number;
    totalSalidas: number;
    aforo: number;
  }[];
}