import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '../../locations/entities/location.entity';

export enum DeviceDirection {
  INGRESO = 'INGRESO',
  SALIDA = 'SALIDA',
}

@Entity({ name: 'dispositivo' })
export class Device {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'nombre', type: 'varchar' })
  nombre: string;

  @Column({ name: 'id_dispositivo_biostar', type: 'varchar', unique: true })
  idDispositivoBiostar: string;

  @Column({
    name: 'direccion',
    type: 'enum',
    enum: DeviceDirection,
  })
  direccion: DeviceDirection;

  @Column({ name: 'id_sede', type: 'uuid' })
  locationId: string;

  @ManyToOne(() => Location, { eager: true })
  @JoinColumn({ name: 'id_sede' })
  location: Location;
}