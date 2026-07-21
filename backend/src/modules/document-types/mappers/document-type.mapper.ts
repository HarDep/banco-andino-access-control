import { DocumentType } from '../entities/document-type.entity';

export class DocumentTypeMapper {
  static toResponse(documentType: DocumentType) {
    return {
      id: documentType.id,
      identificador: documentType.identificador,
      descripcion: documentType.descripcion,
      activo: documentType.activo,
      countryId: documentType.countryId,
      country: documentType.country
        ? {
            id: documentType.country.id,
            nombre: documentType.country.nombre,
            activo: documentType.country.activo,
          }
        : undefined,
    };
  }
}
