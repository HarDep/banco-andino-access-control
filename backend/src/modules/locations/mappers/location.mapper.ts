import { Location } from '../entities/location.entity';

export class LocationMapper {
  static toResponse(location: Location) {
    return {
      id: location.id,
      codigoSede: location.codigoSede,
      nombre: location.nombre,
      direccion: location.direccion,
      aforoMaximo: location.aforoMaximo,
      activo: location.activo,
      cityId: location.cityId,
      city: location.city
        ? {
            id: location.city.id,
            nombre: location.city.nombre,
            activo: location.city.activo,
          }
        : undefined,
    };
  }
}
