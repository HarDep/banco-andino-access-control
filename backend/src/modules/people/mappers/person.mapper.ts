import { Person } from '../entities/person.entity';

export class PersonMapper {
  static toResponse(person: Person) {
    return {
      id: person.id,
      tipoPersona: person.tipoPersona,
      primerNombre: person.primerNombre,
      segundoNombre: person.segundoNombre,
      primerApellido: person.primerApellido,
      segundoApellido: person.segundoApellido,
      telefono: person.telefono,
      email: person.email,
      codigoEmpleado: person.codigoEmpleado,
      fechaIngreso: person.fechaIngreso,
      fechaRetiro: person.fechaRetiro,
      activo: person.activo,
      nivelAcceso: person.nivelAcceso,
      jornada: person.jornada,
      cargo: person.cargo,
      area: person.area,
      centroCosto: person.centroCosto,
      tipoContrato: person.tipoContrato,
      credencialesBiostar: person.biostarCredentials ? {
        id: person.biostarCredentials.id,
        biostarId: person.biostarCredentials.biostarId,
        tarjetaRfid: person.biostarCredentials.tarjetaRfid,
        estaSincronizado: person.biostarCredentials.estaSincronizado
      } : undefined,
      documents: (person.documents ?? []).map((document) => ({
        idDocumento: document.idDocumento,
        numeroDocumento: document.numeroDocumento,
        esPrincipal: document.esPrincipal,
        documentType: document.documentType
          ? {
              id: document.documentType.id,
              identificador: document.documentType.identificador,
              descripcion: document.documentType.descripcion,
              activo: document.documentType.activo,
              country: document.documentType.country
                ? {
                    id: document.documentType.country.id,
                    nombre: document.documentType.country.nombre,
                    activo: document.documentType.country.activo,
                  }
                : undefined,
            }
          : undefined,
      })),
      locations: (person.locations ?? []).map((location) => ({
        locationId: location.locationId,
        esPrincipal: location.esPrincipal,
        location: location.location
          ? {
              id: location.location.id,
              codigoSede: location.location.codigoSede,
              nombre: location.location.nombre,
              direccion: location.location.direccion,
              activo: location.location.activo,
            }
          : undefined,
      })),
    };
  }
}
