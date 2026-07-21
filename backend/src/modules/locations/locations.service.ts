import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { City } from '../cities/entities/city.entity';
import { LocationMapper } from './mappers/location.mapper';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const city = await this.cityRepository.findOne({ where: { id: createLocationDto.cityId as string } });
    if (!city) {
      throw new NotFoundException(`Ciudad con id ${createLocationDto.cityId as string} no encontrada`);
    }

    const location = this.locationRepository.create({ ...createLocationDto, city });
    const saved = await this.locationRepository.save(location);
    return LocationMapper.toResponse(saved);
  }

  async findAll(cityId?: string) {
    const locations = await this.locationRepository.find({
      where: cityId ? { cityId } : undefined,
      order: { nombre: 'ASC' },
    });
    return locations.map((location) => LocationMapper.toResponse(location));
  }

  async findOne(id: string) {
    const location = await this.locationRepository.findOne({ where: { id }, relations: { city: true } as any });
    if (!location) {
      throw new NotFoundException(`Sede con id ${id} no encontrada`);
    }
    return LocationMapper.toResponse(location);
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = await this.locationRepository.preload({ id, ...updateLocationDto });
    if (!location) {
      throw new NotFoundException(`Sede con id ${id} no encontrada`);
    }

    if (updateLocationDto.cityId) {
      const city = await this.cityRepository.findOne({ where: { id: updateLocationDto.cityId as string } });
      if (!city) {
        throw new NotFoundException(`Ciudad con id ${updateLocationDto.cityId as string} no encontrada`);
      }
      location.city = city;
    }

    const saved = await this.locationRepository.save(location);
    return LocationMapper.toResponse(saved);
  }

  async remove(id: string) {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Sede con id ${id} no encontrada`);
    }
    await this.locationRepository.remove(location);
    return { deleted: true, id };
  }
}
