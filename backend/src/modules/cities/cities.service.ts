import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { CityMapper } from './mappers/city.mapper';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const country = await this.countryRepository.findOne({ where: { id: createCityDto.countryId as string } });
    if (!country) {
      throw new NotFoundException(`País con id ${createCityDto.countryId as string} no encontrado`);
    }

    const city = this.cityRepository.create({ ...createCityDto, country });
    const saved = await this.cityRepository.save(city);
    return CityMapper.toResponse(saved);
  }

  async findAll(countryId?: string) {
    const cities = await this.cityRepository.find({
      where: countryId ? { countryId } : undefined,
      order: { nombre: 'ASC' },
    });
    return cities.map((city) => CityMapper.toResponse(city));
  }

  async findOne(id: string) {
    const city = await this.cityRepository.findOne({ where: { id }, relations: { country: true } as any });
    if (!city) {
      throw new NotFoundException(`Ciudad con id ${id} no encontrada`);
    }
    return CityMapper.toResponse(city);
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    const city = await this.cityRepository.preload({ id, ...updateCityDto });
    if (!city) {
      throw new NotFoundException(`Ciudad con id ${id} no encontrada`);
    }

    if (updateCityDto.countryId) {
      const country = await this.countryRepository.findOne({ where: { id: updateCityDto.countryId as string } });
      if (!country) {
        throw new NotFoundException(`País con id ${updateCityDto.countryId as string} no encontrado`);
      }
      city.country = country;
    }

    const saved = await this.cityRepository.save(city);
    return CityMapper.toResponse(saved);
  }

  async remove(id: string) {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(`Ciudad con id ${id} no encontrada`);
    }
    await this.cityRepository.remove(city);
    return { deleted: true, id };
  }
}
