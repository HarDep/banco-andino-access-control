import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Person } from './person.entity';

@Entity({ name: 'credencial_biostar' })
export class BiostarCredentials {
    @PrimaryColumn({ name: 'id', type: 'uuid' })
    id: string;
    
    @Column({ name: 'id_biostar', type: 'varchar'})
    biostarId: string;

    @Column({ name: 'tarjeta_rfid', type: 'varchar' })
    tarjetaRfid: string;

    @Column({ name: 'esta_sincronizado', type: 'boolean' })
    estaSincronizado: boolean;
 
    @OneToOne(() => Person, (person) => person.biostarCredentials, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'empleado_id' })
    person: Person;

    @Column({ name: 'empleado_id', type: 'uuid' })
    empleadoId: string
}