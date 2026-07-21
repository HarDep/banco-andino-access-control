import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { CapacityQueryDto } from './dto/query-params.dto';
import { EventAccess, EventType } from './entities/event-access.entity';
import { Between, Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CapacityMapper } from './mapper/capacity.mapper';
import type { IBioStarClient } from './interfaces/biostar-client';
import { I_BIOSTAR_CLIENT_TOKEN } from './interfaces/biostar-client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Person } from '../people/entities/person.entity';
import { Subject } from 'rxjs';

@Injectable()
export class CapacityService {
  private lastEventsUpdateTimestamp: Date = new Date();
  public update$ = new Subject<any>();

  constructor(
    @Inject(I_BIOSTAR_CLIENT_TOKEN)
    private biostarClient: IBioStarClient,
    @InjectRepository(EventAccess)
    private eventAccessRepo: Repository<EventAccess>,
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  async findAll(query: CapacityQueryDto) {
    if (query.startDate && query.tipo) {
      const from = new Date(query.startDate);
      if (query.tipo === 'range' && !query.endDate) {
        throw new BadRequestException('Debe especificar el rango de fechas');
      }
      const to = query.tipo === 'day' ? new Date(from.getTime() + 24 * 60 * 60 * 1000) : query.tipo === 'month' ? new Date(from.getFullYear(), from.getMonth() + 1, 1) : new Date(query.endDate!);
      const condition = query.locationId ? { locationId: query.locationId, timestamp: Between(from, to) } : { timestamp: Between(from, to) };
      const accessEvents = await this.eventAccessRepo.find({
        where: condition,
        relations: { person: true, sede: true },
        order: { timestamp: 'DESC' },
      });
      return CapacityMapper.toCapacityInfo(accessEvents, true);
    }
    // desde el comienzo de este dia hasta la fecha que se consulta
    const from = new Date();
    from.setHours(0);
    from.setMinutes(0);
    from.setSeconds(0);
    const to = new Date();
    const condition = query.locationId ? { locationId: query.locationId, timestamp: Between(from, to) } : { timestamp: Between(from, to) };
    const accessEvents = await this.eventAccessRepo.find({
      where: condition,
      relations: { person: true, sede: true },
      order: { timestamp: 'DESC' },
    });
    return CapacityMapper.toCapacityInfo(accessEvents, false);
  }

  @Cron('45 * * * * *')
  async updateEvents() {
    const from = this.lastEventsUpdateTimestamp;
    const to = new Date();
    const events = await this.biostarClient.getEvents(from, to);
    for (const event of events) {
      const device = await this.deviceRepo.findOne({ 
        where: { idDispositivoBiostar: event.device_id.id },
        relations: { location: true }
      });
      if (!device) {
        continue;
      }
      const person = await this.personRepo.findOne({ 
        where: { biostarCredentials: { biostarId: event.user_id?.user_id } },
        relations: { biostarCredentials: true }
      });
      if (!person) {
        continue;
      }
      await this.eventAccessRepo.save({
        timestamp: new Date(event.datetime),
        locationId: device.location.id,
        personId: person.id,
        tipo: device.direccion as unknown as EventType
      });
    }
    this.notifyChanges();
    this.lastEventsUpdateTimestamp = to;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async rebootEvents() {
    const from = new Date();
    from.setDate(from.getDate() - 1);
    const to = new Date();
    const events = await this.eventAccessRepo.find({
      where: { timestamp: Between(from, to) },
      relations: { person: true, sede: true },
      order: { timestamp: 'DESC' },
    });
    const peopleEvents = events.map(e => e.person)
      .filter((value, index, self) => self.findIndex(person => value.id === person.id) === index);
    for (const person of peopleEvents) {
      const lastEvent = events.find(e => e.person.id === person.id);
      if (lastEvent?.tipo === 'INGRESO') {
        await this.eventAccessRepo.save({
          timestamp: to,
          locationId: lastEvent.sede.id,
          personId: person.id,
          tipo: 'SALIDA' as EventType
        });
      }
    }
    const fromStamp = new Date(to);
    fromStamp.setSeconds(fromStamp.getSeconds() - 1);
    this.notifyChanges();
  }

  async notifyChanges() {
    const from = new Date();
    from.setHours(0);
    from.setMinutes(0);
    from.setSeconds(0);
    const to = new Date();
    const events = await this.eventAccessRepo.find({
      where: { timestamp: Between(from, to) },
      relations: { person: true, sede: true },
      order: { timestamp: 'DESC' },
    });
    const data = CapacityMapper.toCapacityInfo(events, false);
    this.update$.next(data);
  }

}
