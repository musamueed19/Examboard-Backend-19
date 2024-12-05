import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from 'src/db/entities/semester.entity';
import { ILike, In, IsNull, LessThanOrEqual, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { ExamPaperSettingsService } from '../exam_paper_settings/exam_paper_settings.service';
import { log } from 'console';

@Injectable()
export class SemestersService {
  constructor(
    @InjectRepository(Semester)
    private semesterRepository: Repository<Semester>,
    private examPaperService: ExamPaperSettingsService,
  ){}
  async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    // Check for an existing semester with the same title
    const existingSemester = await this.semesterRepository.findOne({
      where: {
        title: createSemesterDto.title,
      },
    });
    console.log(existingSemester);
  
    if (existingSemester) {
      throw new BadRequestException(`${existingSemester.title} already exists`);
    }
  
    // Check if there is already an active semester
    if (createSemesterDto.is_Active) {
      const activeSemester = await this.activeSemester();
      console.log(activeSemester);
  
      if (activeSemester) {
        throw new BadRequestException(`${activeSemester.title} already active`);
      }
    }
  
    // Check for overlapping semester dates
    const overlappingSemester = await this.semesterRepository.findOne({
      where: {
        start_date: LessThanOrEqual(createSemesterDto.end_date),
        end_date: MoreThanOrEqual(createSemesterDto.start_date),
      },
    });
  
    if (overlappingSemester) {
      throw new BadRequestException(
        `Dates conflict with existing semester: ${overlappingSemester.title}`
      );
    }
  
    // Validate the start and end date of the semester
    if (createSemesterDto.start_date > createSemesterDto.end_date) {
      throw new BadRequestException(`Start date cannot be after end date`);
    }
  
    // Validate mid-term and final-term dates only if they are provided
    if (
      createSemesterDto.mid_term_date &&
      (createSemesterDto.mid_term_date < createSemesterDto.start_date ||
        createSemesterDto.mid_term_date > createSemesterDto.end_date)
    ) {
      throw new BadRequestException(
        `Mid-term start date must be within the semester dates`
      );
    }
  
    if (
      createSemesterDto.final_term_date &&
      (createSemesterDto.final_term_date < createSemesterDto.start_date ||
        createSemesterDto.final_term_date > createSemesterDto.end_date)
    ) {
      throw new BadRequestException(
        `Final-term start date must be within the semester dates`
      );
    }
  
    if (
      createSemesterDto.mid_term_end_date &&
      (createSemesterDto.mid_term_end_date < createSemesterDto.start_date ||
        createSemesterDto.mid_term_end_date > createSemesterDto.end_date)
    ) {
      throw new BadRequestException(
        `Mid-term end date must be within the semester dates`
      );
    }
  
    if (
      createSemesterDto.final_term_end_date &&
      (createSemesterDto.final_term_end_date < createSemesterDto.start_date ||
        createSemesterDto.final_term_end_date > createSemesterDto.end_date)
    ) {
      throw new BadRequestException(
        `Final-term end date must be within the semester dates`
      );
    }
  
    // Validate mid-term date range
    if (
      createSemesterDto.mid_term_date &&
      createSemesterDto.mid_term_end_date &&
      createSemesterDto.mid_term_date > createSemesterDto.mid_term_end_date
    ) {
      throw new BadRequestException(
        `Mid-term start date cannot be after the mid-term end date`
      );
    }
  
    // Validate final-term date range
    if (
      createSemesterDto.final_term_date &&
      createSemesterDto.final_term_end_date &&
      createSemesterDto.final_term_date > createSemesterDto.final_term_end_date
    ) {
      throw new BadRequestException(
        `Final-term start date cannot be after the final-term end date`
      );
    }
  
    // Validate mid-term and final-term sequence
    if (
      createSemesterDto.mid_term_end_date &&
      createSemesterDto.final_term_date &&
      createSemesterDto.mid_term_end_date > createSemesterDto.final_term_date
    ) {
      throw new BadRequestException(
        `Mid-term end date cannot be after the final-term start date`
      );
    }
  
    // Create and save the semester
    const semester = this.semesterRepository.create({
      title: createSemesterDto.title,
      is_Active: createSemesterDto.is_Active,
      start_date: createSemesterDto.start_date,
      end_date: createSemesterDto.end_date,
      mid_term_date: createSemesterDto.mid_term_date || null,
      mid_term_end_date: createSemesterDto.mid_term_end_date || null,
      final_term_date: createSemesterDto.final_term_date || null,
      final_term_end_date: createSemesterDto.final_term_end_date || null,
      created_on: new Date(),
      updated_on: new Date(),
      archived_on: null,
    });
  
    await this.semesterRepository.save(semester);
    return semester;
  }
  

  async findAll(): Promise<Semester[]> {
    const Semesters =  await this.semesterRepository.find({
      where: {archived_on: IsNull()}
    });  
    if (!Semesters) {
      throw new NotFoundException(`No Semester Exists`)
    }
    return Semesters;
  }

  async findOne(id: string): Promise<Semester> {
    const semester = await this.semesterRepository.findOneBy({ 
      id: id,
    })
    if(!semester) {
      throw new BadRequestException(`semester does not exist`)
    }
    return semester;
  }

  async activeSemester(): Promise<Semester> {
    const semester = await this.semesterRepository.findOne({
        where: { 
          is_Active: true,
          archived_on: IsNull(), 
        }
    });
    
    return semester 
}

async searchActiveSemester(search?: string, limit = 10, page = 1): Promise<{ data: Semester[]; total: number }> {
  const [data, total] = await this.semesterRepository.findAndCount({
    where: {
      is_Active: true,
      archived_on: IsNull(),
      title: search ? Like(`%${search}%`) : undefined,
    },
    order: {
      start_date: 'ASC', 
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  return { data, total };
}

async searchInactiveSemester(search?: string, limit = 10, page = 1): Promise<{ data: Semester[]; total: number }> {
  const [data, total] = await this.semesterRepository.findAndCount({
    where: {
      is_Active: false,
      archived_on: IsNull(),
      title: search ? Like(`%${search}%`) : undefined,
    },
    order: {
      start_date: 'ASC', 
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  return { data, total };
}

async searchAllSemesters(search?: string, limit = 10, page = 1): Promise<{ data: Semester[]; total: number }> {
  const [data, total] = await this.semesterRepository.findAndCount({
    where: {
      title: search ? Like(`%${search}%`) : undefined,
      archived_on: IsNull(),
    },
    order: {
      start_date: 'ASC',
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  return { data, total };
}



  async lookUp(id: string): Promise<any> {
    const semester = await this.findOne(id)
    if(!semester) {
      throw new BadRequestException(`${semester.id} does not exist`)
    }
    // const examPaper = await this.examPaperService.findAllOfSameSemester(id);
    return semester;
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
    const semester = await this.semesterRepository.findOne({ where: { 
      id: id,
      archived_on: IsNull(),
    } });
    if (!semester) {
      throw new NotFoundException('Semester not found');
    }
  
    // Extract current or incoming values for all dates
    const startDate = updateSemesterDto.start_date || semester.start_date;
    const endDate = updateSemesterDto.end_date || semester.end_date;
    const midTermDate = updateSemesterDto.mid_term_date || semester.mid_term_date;
    const midTermEndDate = updateSemesterDto.mid_term_end_date || semester.mid_term_end_date;
    const finalTermDate = updateSemesterDto.final_term_date || semester.final_term_date;
    const finalTermEndDate = updateSemesterDto.final_term_end_date || semester.final_term_end_date;
  
    // Validate overall semester start and end dates
    if (startDate > endDate) {
      throw new BadRequestException('Semester start date cannot be after end date');
    }
  
    // Check mid-term and final-term dates fall within the semester dates
    if (midTermDate && (midTermDate < startDate || midTermDate > endDate)) {
      throw new BadRequestException('Mid-term start date must be within the semester dates');
    }
    if (midTermEndDate && (midTermEndDate < startDate || midTermEndDate > endDate)) {
      throw new BadRequestException('Mid-term end date must be within the semester dates');
    }
    if (finalTermDate && (finalTermDate < startDate || finalTermDate > endDate)) {
      throw new BadRequestException('Final-term start date must be within the semester dates');
    }
    if (finalTermEndDate && (finalTermEndDate < startDate || finalTermEndDate > endDate)) {
      throw new BadRequestException('Final-term end date must be within the semester dates');
    }
  
    // Additional check to ensure logical sequence of mid-term and final-term dates
    if (midTermDate && finalTermDate && midTermDate > finalTermDate) {
      throw new BadRequestException('Mid-term start date cannot be after final-term start date');
    }
    if (midTermEndDate && finalTermEndDate && midTermEndDate > finalTermEndDate) {
      throw new BadRequestException('Mid-term end date cannot be after final-term end date');
    }
  
    // Check for active semester conflicts
    if (updateSemesterDto.is_Active) {
      const activeSemesterConflict = await this.semesterRepository.findOne({
        where: { is_Active: true, id: Not(id) },
      });
      if (activeSemesterConflict) {
        throw new BadRequestException('Only one semester can be active at a time');
      }
    }
  
    // Check for overlapping semesters
    const overlappingSemester = await this.semesterRepository.findOne({
      where: {
        id: Not(id),
        start_date: LessThanOrEqual(endDate),
        end_date: MoreThanOrEqual(startDate),
      },
    });
    if (overlappingSemester) {
      throw new BadRequestException(`Dates conflict with existing semester: ${overlappingSemester.title}`);
    }
  
    // Proceed with the update if all validations pass
    Object.assign(semester, updateSemesterDto);
    await this.semesterRepository.save(semester);
    return semester;
  }
  
  

  // async remove(id: string): Promise<any> {
  //   const semester = await this.findOne(id);
  
  //   if (!semester) {
  //     throw new NotFoundException('Semester not found');
  //   }
  
  //   // semester.archived_on = new Date();
  //   this.semesterRepository.delete(id);
  //   // await this.semesterRepository.save(semester);
  
  //   return `Semester ${semester.title} archived successfully`;
  // }
  
  // async searchSemester(term: string): Promise<Semester[]> {
  //   // Search only by title using TypeORM's `ILike` for case-insensitive matches
  //   const searchResults = await this.semesterRepository.find({
  //     where: { title: ILike(`%${term}%`) },
  //   });
  // console.log(term);
  
  //   console.log(searchResults);
    
  //   if (searchResults.length === 0) {
  //     throw new NotFoundException(`No semesters found matching the search term: ${term}`);
  //   }
  
  //   return searchResults;
  // }
  
  

  async removeAll(ids: string | string[]): Promise<any> {
    const idArray = Array.isArray(ids) ? ids : [ids];

    console.log('Input IDs:', idArray);

    // Fetch semesters with matching IDs
    const semesters = await this.semesterRepository.find({
        where: { id: In(idArray) },
    });

    console.log('Fetched Semesters Count:', semesters.length);
    console.log('Fetched Semesters:', semesters);
    console.log('Requested IDs Count:', idArray.length);
    console.log('Requested IDs:', idArray);

    // Create a set of fetched IDs for easier checking
    const fetchedIds = semesters.map(semester => semester.id);

    // Check for missing IDs and log them
    const missingIds = idArray.filter(id => !fetchedIds.includes(id));
    if (missingIds.length > 0) {
        console.warn('The following IDs were not found:', missingIds.join(', '));
        // You can decide whether to throw an error or continue
    }

    // Perform the soft delete by updating the `archived_on` column
    const updatePromises = semesters.map(async semester => {
        semester.archived_on = new Date(); // Set the current date
        return this.semesterRepository.save(semester); // Save the updated entity
    });

    await Promise.all(updatePromises);

    return `Semesters archived successfully`;
}



}
