import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';

@Entity({ name: 'tipo_documento' })
export class DocumentType {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'identificador', type: 'varchar', length: 100, unique: true })
  identificador: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'id_pais', type: 'uuid' })
  countryId: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'id_pais' })
  country: Country;
}
