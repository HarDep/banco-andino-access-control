import { Country } from '../entities/country.entity';

export class CountryMapper {
  static toResponse(country: Country) {
    return {
      id: country.id,
      nombre: country.nombre,
      activo: country.activo,
    };
  }
}
