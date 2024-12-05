import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Designation } from 'src/db/entities/designation.entity';
import { ILike, In, Like, Repository } from 'typeorm';

@Injectable()
export class DesignationsService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
  ) {}
  async create(createDesignationDto: CreateDesignationDto): Promise<any> {
    const designationExists = await this.designationRepository.findOneBy({
      designation: createDesignationDto.designation_title,
    });
    if (designationExists) {
      throw new BadRequestException(
        `${designationExists.designation} already exists`,
      );
    }
    const designation = this.designationRepository.create({
      designation: createDesignationDto.designation_title,
    });
    await this.designationRepository.save(designation);
    return `${createDesignationDto.designation_title} added in the designation table`;
  }

  async findAll(): Promise<Designation[]> {
    return await this.designationRepository.find();
  }
  async lookUp(): Promise<Designation[]> {
    return await this.designationRepository.find();
  }
  async findOne(id: string): Promise<Designation> {
    const designation = await this.designationRepository.findOneBy({ id: id });
    if (!designation) {
      throw new NotFoundException(
        `Designation does not exist`,
      );
    }
    return designation;
  }

  async update(
    id: string,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    const designation = await this.findOne(id);
    if (updateDesignationDto.designation_title)
      designation.designation = updateDesignationDto.designation_title;
    await this.designationRepository.save(designation);
    return designation;
  }

  async remove(ids: string): Promise<any> {
    // const designation = await this.findOne(id);
    // await this.designationRepository.delete(designation);
    // return `${designation.designation} designation deleted successfully`;

    const idArray = Array.isArray(ids) ? ids : [ids];

    console.log('Input IDs:', idArray);

    const designations = await this.designationRepository.find({
      where: { id: In(idArray) },
    });

    // console.log('Fetched Semesters Count:', designations.length);
    // console.log('Fetched Semesters:', designations);
    // console.log('Requested IDs Count:', idArray.length);
    // console.log('Requested IDs:', idArray);

    const fetchedIds = designations.map((designation) => designation.id);

    const missingIds = idArray.filter((id) => !fetchedIds.includes(id));
    if (missingIds.length > 0) {
      console.warn('The following IDs were not found:', missingIds.join(', '));
    }

    const deletePromises = designations.map(async (designation) => {
      return this.designationRepository.delete(designation.id);
    });

    await Promise.all(deletePromises);

    return `Designations deleted successfully`;
  }
  async searchDesignation(search?: string, limit = 10, page = 1): Promise<{ data: Designation[]; total: number }> {
  const [data, total] = await this.designationRepository.findAndCount({
    where: {
      designation: search ? Like(`%${search}%`) : undefined,
    },
    order: {
      designation: 'ASC', // Sort by start_date in ascending order
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  return { data, total };
}
}
