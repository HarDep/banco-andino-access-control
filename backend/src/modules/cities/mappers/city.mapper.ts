import { City } from '../entities/city.entity';

export class CityMapper {
  static toResponse(city: City) {
    return {
      id: city.id,
      nombre: city.nombre,
      activo: city.activo,
      countryId: city.countryId,
      country: city.country
        ? {
            id: city.country.id,
            nombre: city.country.nombre,
            activo: city.country.activo,
          }
        : undefined,
    };
  }
}
