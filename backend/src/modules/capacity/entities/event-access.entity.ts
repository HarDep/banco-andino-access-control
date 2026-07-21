import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Person } from '../../people/entities/person.entity';
import { Location } from '../../locations/entities/location.entity';

export enum EventType {
  INGRESO = 'INGRESO',
  SALIDA = 'SALIDA',
}

@Entity({ name: 'evento_acceso' })
export class EventAccess {

  @PrimaryColumn({ name: 'empleado_id', type: 'uuid' })
  personId: string;

  @PrimaryColumn({ name: 'sede_id', type: 'uuid' })
  locationId: string;

  @PrimaryColumn({ name: 'timestamp', type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({
    name: 'tipo',
    type: 'enum',
    enum: EventType,
  })
  tipo: EventType;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'empleado_id' })
  person: Person;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'sede_id' })
  sede: Location;
}