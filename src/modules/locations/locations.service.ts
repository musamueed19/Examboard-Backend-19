import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/db/entities/location.entity';
import { ILike, In, Like, Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}
  async create(createLocationDto: CreateLocationDto): Promise<any> {
    const locationExists = await this.locationRepository.findOneBy({
      location: createLocationDto.location,
    });
    if (locationExists) {
      throw new BadRequestException(
        `${locationExists.location} already exists`,
      );
    }
    const location = this.locationRepository.create({
      location: createLocationDto.location,
    });
    await this.locationRepository.save(location);
    return `${location.location} added in the database`;
  }

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find();
  }

  async lookUp(): Promise<Location[]> {
    const locations = await this.locationRepository.find();
    if (!locations) {
      throw new NotFoundException(`no location`);
    }
    return locations;
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOneBy({ id: id });
    if (!location) {
      throw new NotFoundException(`location not found`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);
    if (updateLocationDto.location)
      location.location = updateLocationDto.location;
    await this.locationRepository.save(location);
    return location;
  }

  async remove(ids: string): Promise<any> {
    // const location = await this.findOne(id);
    // await this.locationRepository.delete(location);
    // return `loaction ${location.location} deleted successfully`;

    // const designation = await this.findOne(id);
    // await this.designationRepository.delete(designation);
    // return `${designation.designation} designation deleted successfully`;

    const idArray = Array.isArray(ids) ? ids : [ids];

    console.log('Input IDs:', idArray);

    const locations = await this.locationRepository.find({
      where: { id: In(idArray) },
    });

    // console.log('Fetched Semesters Count:', designations.length);
    // console.log('Fetched Semesters:', designations);
    // console.log('Requested IDs Count:', idArray.length);
    // console.log('Requested IDs:', idArray);

    const fetchedIds = locations.map((location) => location.id);

    const missingIds = idArray.filter((id) => !fetchedIds.includes(id));
    if (missingIds.length > 0) {
      console.warn('The following IDs were not found:', missingIds.join(', '));
    }

    const deletePromises = locations.map(async (location) => {
      return this.locationRepository.delete(location.id);
    });

    await Promise.all(deletePromises);

    return `locations deleted successfully`;
  }

  async searchLocation(
    search?: string,
    limit = 10,
    page = 1,
  ): Promise<{ data: Location[]; total: number }> {
    const [data, total] = await this.locationRepository.findAndCount({
      where: {
        location: search ? Like(`%${search}%`) : undefined,
      },
      order: {
        location: 'ASC', // Sort by start_date in ascending order
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }
}
       

