import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '../../cities/entities/city.entity';

@Entity({ name: 'pais' })
export class Country {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];

}
