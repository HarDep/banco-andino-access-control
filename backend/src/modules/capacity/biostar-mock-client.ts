import { InjectRepository } from "@nestjs/typeorm";
import { BioStarEvent, BioStarUser, IBioStarClient } from "./interfaces/biostar-client";
import { Between, Repository } from "typeorm";
import { Person } from "../people/entities/person.entity";
import { Location } from "../locations/entities/location.entity";
import { EventAccess } from "./entities/event-access.entity";
import { Device, DeviceDirection } from "./entities/device.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BiostarMockClient implements IBioStarClient {
    private sessionToken = 'mock-session-token';
    private locationsCodes = ['CAL-01', 'BOG-CD', 'MED-01', 'PTY-01', 'CHI-01', 'BOG-TOR'];

  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
    @InjectRepository(EventAccess)
    private eventAccessRepo: Repository<EventAccess>,
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
  ) {}

  async login(): Promise<string> {
    return this.sessionToken;  
  }
  async createUser(user: BioStarUser): Promise<any> {
    return { code: '0', message: 'success' };
  }
  async updateUser(id: string, data: Partial<BioStarUser>): Promise<any> {
    return { code: '0', message: 'success' };
  }
  async disableUser(id: string): Promise<any> {
    return { code: '0', message: 'success' };
  }
  async getEvents(from?: Date, to?: Date, limit?: number): Promise<BioStarEvent[]> {
    const randomBool = Math.random() > 0.5;
    if (randomBool) {
      const randomLocation = this.locationsCodes[Math.floor(Math.random() * this.locationsCodes.length)];
      const location = await this.locationRepo.findOne({ where: { codigoSede: randomLocation } });
      const people = await this.personRepo.find({ where: { locations: { locationId: location?.id } }, 
        relations: { biostarCredentials: true } });
      if (!people.length) {
        return [];
      }
      let randomPerson = people[Math.floor(Math.random() * people.length)];
      let count = 0;
      while (!randomPerson.biostarCredentials) {
        randomPerson = people[Math.floor(Math.random() * people.length)];
        count++;
        if (count >= people.length) {
          return [];
        }
      }
      const last = await this.eventAccessRepo.findOne({
        where: {
          personId: randomPerson.id
        },
        order: { timestamp: 'DESC' },
      });
      const dir = last ? last.tipo === 'INGRESO' ? 'SALIDA' : 'INGRESO' : 'INGRESO';
      const devices = await this.deviceRepo.find({ where: { locationId: location?.id, direccion: dir as DeviceDirection  } });
      if (!devices.length) {
        return [];
      }
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      return [
        {
          id: 'mock-id',
          datetime: new Date().toISOString(),
          server_datetime: new Date().toISOString(),
          device_id: {
            id: randomDevice.idDispositivoBiostar,
            name: randomDevice.nombre,
          },
          user_id: {
            user_id: randomPerson.biostarCredentials.biostarId,
            name: randomPerson.codigoEmpleado,
          },
          event_type_id: {
            code: 4088,
            name: 'ACCESS_GRANTED',
          }
        }
      ]
    }
    return [];
  }
}