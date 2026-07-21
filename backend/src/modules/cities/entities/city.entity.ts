import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity({ name: 'ciudad' })
export class City {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'id_pais', type: 'uuid' })
  countryId: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @ManyToOne(() => Country, (country) => country.cities, { eager: true })
  @JoinColumn({ name: 'id_pais' })
  country: Country;

  @OneToMany(() => Location, (location) => location.city)
  locations: Location[];
}
