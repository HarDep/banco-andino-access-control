import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Person } from './person.entity';
import { DocumentType } from '../../document-types/entities/document-type.entity';

@Entity({ name: 'persona_documento' })
export class PersonDocument {
  @PrimaryColumn({ name: 'id_documento', type: 'uuid' })
  idDocumento: string;

  @PrimaryColumn({ name: 'numero_documento', type: 'varchar', length: 100 })
  numeroDocumento: string;

  @Column({ name: 'id_persona', type: 'uuid' })
  personId: string;

  @Column({ name: 'es_principal', type: 'boolean', default: false })
  esPrincipal: boolean;

  @ManyToOne(() => Person, (person) => person.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_persona' })
  person: Person;

  @ManyToOne(() => DocumentType, { eager: true })
  @JoinColumn({ name: 'id_documento' })
  documentType: DocumentType;
}
