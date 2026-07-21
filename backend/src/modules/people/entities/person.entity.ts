import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeLocation } from './employee-location.entity';
import { PersonDocument } from './person-document.entity';
import { BiostarCredentials } from './biostar-credentials.entity';

@Entity({ name: 'persona' })
export class Person {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'tipo_persona', type: 'varchar', length: 50 })
  tipoPersona: string;

  @Column({ name: 'primer_nombre', type: 'varchar', length: 100 })
  primerNombre: string;

  @Column({ name: 'segundo_nombre', type: 'varchar', length: 100, nullable: true })
  segundoNombre?: string;

  @Column({ name: 'primer_apellido', type: 'varchar', length: 100 })
  primerApellido: string;

  @Column({ name: 'segundo_apellido', type: 'varchar', length: 100, nullable: true })
  segundoApellido?: string;

  @Column({ name: 'telefono', type: 'varchar', length: 50, nullable: true })
  telefono?: string;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
  email?: string;

  @Column({ name: 'codigo_empleado', type: 'varchar', length: 50, nullable: true })
  codigoEmpleado?: string;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: true })
  fechaIngreso?: string;

  @Column({ name: 'fecha_retiro', type: 'date', nullable: true })
  fechaRetiro?: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'nivel_acceso', type: 'varchar', length: 100, nullable: true })
  nivelAcceso?: string;

  @Column({ name: 'jornada', type: 'varchar', length: 100, nullable: true })
  jornada?: string;

  @Column({ name: 'cargo', type: 'varchar', length: 150, nullable: true })
  cargo?: string;

  @Column({ name: 'area', type: 'varchar', length: 150, nullable: true })
  area?: string;

  @Column({ name: 'centro_costo', type: 'varchar', length: 150, nullable: true })
  centroCosto?: string;

  @Column({ name: 'tipo_contrato', type: 'varchar', length: 100, nullable: true })
  tipoContrato?: string;

  @OneToMany(() => PersonDocument, (document) => document.person, {
    cascade: ['insert', 'update'],
  })
  documents: PersonDocument[];

  @OneToMany(() => EmployeeLocation, (employeeLocation) => employeeLocation.person, {
    cascade: ['insert', 'update'],
  })
  locations: EmployeeLocation[];

  @OneToOne(() => BiostarCredentials, (biostarCredentials) => biostarCredentials.person, {
    cascade: ['insert', 'update'],
  })
  biostarCredentials: BiostarCredentials;
}
