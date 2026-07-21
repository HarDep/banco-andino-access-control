import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '../../cities/entities/city.entity';

@Entity({ name: 'sede' })
export class Location {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'codigo_sede', type: 'varchar', length: 50 })
  codigoSede: string;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'direccion', type: 'varchar', length: 255, nullable: true })
  direccion?: string;

  @Column({ name: 'id_ciudad', type: 'uuid' })
  cityId: string;

  @Column({ name: 'aforo_maximo', type: 'int', nullable: true })
  aforoMaximo?: number;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @ManyToOne(() => City, (city) => city.locations, { eager: true })
  @JoinColumn({ name: 'id_ciudad' })
  city: City;

}
