import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { CountryMapper } from './mappers/country.mapper';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const country = this.countryRepository.create(createCountryDto);
    const saved = await this.countryRepository.save(country);
    return CountryMapper.toResponse(saved);
  }

  async findAll() {
    const countries = await this.countryRepository.find({ order: { nombre: 'ASC' } });
    return countries.map((country) => CountryMapper.toResponse(country));
  }

  async findOne(id: string) {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`País con id ${id} no encontrado`);
    }
    return CountryMapper.toResponse(country);
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    const country = await this.countryRepository.preload({ id, ...updateCountryDto });
    if (!country) {
      throw new NotFoundException(`País con id ${id} no encontrado`);
    }
    const saved = await this.countryRepository.save(country);
    return CountryMapper.toResponse(saved);
  }

  async remove(id: string) {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`País con id ${id} no encontrado`);
    }
    await this.countryRepository.remove(country);
    return { deleted: true, id };
  }
}
