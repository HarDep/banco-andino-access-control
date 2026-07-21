import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { DocumentType } from './entities/document-type.entity';
import { Country } from '../countries/entities/country.entity';
import { DocumentTypeMapper } from './mappers/document-type.mapper';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    const country = await this.countryRepository.findOne({ where: { id: createDocumentTypeDto.countryId } });
    if (!country) {
      throw new NotFoundException(`País con id ${createDocumentTypeDto.countryId} no encontrado`);
    }

    const documentType = this.documentTypeRepository.create({
      ...createDocumentTypeDto,
      country,
    });

    const saved = await this.documentTypeRepository.save(documentType);
    return DocumentTypeMapper.toResponse(saved);
  }

  async findAll(countryId?: string) {
    const query = this.documentTypeRepository.createQueryBuilder('documentType').leftJoinAndSelect('documentType.country', 'country');
    if (countryId) {
      query.where('documentType.countryId = :countryId', { countryId });
    }

    const documentTypes = await query.getMany();
    return documentTypes.map((documentType) => DocumentTypeMapper.toResponse(documentType));
  }

  async findOne(id: string) {
    const documentType = await this.documentTypeRepository.findOne({
      where: { id },
      relations: { country: true } as any,
    });

    if (!documentType) {
      throw new NotFoundException(`Tipo de documento con id ${id} no encontrado`);
    }

    return DocumentTypeMapper.toResponse(documentType);
  }

  async update(id: string, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    const documentType = await this.documentTypeRepository.preload({ id, ...updateDocumentTypeDto });
    if (!documentType) {
      throw new NotFoundException(`Tipo de documento con id ${id} no encontrado`);
    }

    if (updateDocumentTypeDto.countryId) {
      const country = await this.countryRepository.findOne({ where: { id: updateDocumentTypeDto.countryId } });
      if (!country) {
        throw new NotFoundException(`País con id ${updateDocumentTypeDto.countryId} no encontrado`);
      }
      documentType.country = country;
    }

    const saved = await this.documentTypeRepository.save(documentType);
    return DocumentTypeMapper.toResponse(saved);
  }

  async remove(id: string) {
    const documentType = await this.documentTypeRepository.findOne({ where: { id } });
    if (!documentType) {
      throw new NotFoundException(`Tipo de documento con id ${id} no encontrado`);
    }

    await this.documentTypeRepository.remove(documentType);
    return { deleted: true, id };
  }

  async toggleActive(id: string) {
    const documentType = await this.documentTypeRepository.findOne({ where: { id } });
    if (!documentType) {
      throw new NotFoundException(`Tipo de documento con id ${id} no encontrado`);
    }
    documentType.activo = !documentType.activo;
    const saved = await this.documentTypeRepository.save(documentType);
    return DocumentTypeMapper.toResponse(saved);
  }
}
