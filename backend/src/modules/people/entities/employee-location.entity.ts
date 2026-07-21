import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Person } from './person.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity({ name: 'empleado_sede_acceso' })
export class EmployeeLocation {
  @PrimaryColumn({ name: 'empleado_id', type: 'uuid' })
  employeeId: string;

  @PrimaryColumn({ name: 'sede_id', type: 'uuid' })
  locationId: string;

  @Column({ name: 'es_principal', type: 'boolean', default: false })
  esPrincipal: boolean;

  @ManyToOne(() => Person, (person) => person.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empleado_id' })
  person: Person;

  @ManyToOne(() => Location, { eager: true })
  @JoinColumn({ name: 'sede_id' })
  location: Location;
}
