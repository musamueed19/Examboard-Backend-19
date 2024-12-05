import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from 'src/db/entities/section.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { title } from 'process';
import { SectionCoordinator } from 'src/db/entities/section_coordinator.entity';
import { FacultiesService } from '../faculties/faculties.service';
import { SectionCoordinatorsService } from '../section_coordinators/section_coordinators.service';
import { Semester } from 'src/db/entities/semester.entity';
import { SemestersService } from '../semesters/semesters.service';
import { CourseAllocationsService } from '../course_allocations/course_allocations.service';
import { format } from 'date-fns';
@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    private readonly facultyService: FacultiesService,
    @Inject(forwardRef(() => SectionCoordinatorsService))
    private coordinatorService: SectionCoordinatorsService,
    @InjectRepository(SectionCoordinator)
    private coordinatorRepository: Repository<SectionCoordinator>,
    private readonly semesterService: SemestersService,
    private readonly allocateCoursesService: CourseAllocationsService,
  ){}

  async findSections():Promise<any> {
    // const sections = await this.sectionRepository.find();
    // const coordinators = await this.facultyService.findAll();
    // if(!sections || sections.length === 0) {
    //   throw new NotFoundException('no section exists');
    // }
    // if(!coordinators || coordinators.length === 0) {
    //   throw new NotFoundException('no faculty member exists');
    // }
    // const facultyDetails = coordinators.map(coordinator => ({
    //   id: coordinator.id,
    //   name: coordinator.name,
    // }));
  
    // return {
    //   sections,
    //   coordinators: facultyDetails,
    // };
    const faculties = await this.facultyService.findAll();
    const activeSemester = await this.semesterService.activeSemester();
    const facultyDetails = faculties.map(faculty => ({
        id: faculty.id,
        name: faculty.name,
      }));

    return {
      facultyDetails,
      activeSemester, 
    };
  }


  async createSection(id: string, createSectionDto: CreateSectionDto): Promise<any> {
  const checkSection = await this.sectionRepository.findOne({
    where : {title : createSectionDto.title}
  })
  if(checkSection) {
    throw new BadRequestException(`Section Already Exist`)
  }
  const section = this.sectionRepository.create({
    title: createSectionDto.title
  })
  console.log(createSectionDto.coordinator_id);
  const checkCoordinator = await this.facultyService.findOne(createSectionDto.coordinator_id);
      if(!checkCoordinator)
        {
          throw new NotFoundException(`coordinator not found`);
        }
        
        await this.sectionRepository.save(section);
        const coordinator = this.coordinatorRepository.create({
          section: {id: section.id},
          faculty: {id: createSectionDto.coordinator_id},
          semester: {id: id},
          from_date: new Date(),
        })
       
        await this.coordinatorRepository.save(coordinator);
       return {
        coordinator: {
          id: checkCoordinator.id,
          name: checkCoordinator.name,
        },
      }

  }


  // async create(semesterId: string, createSectionDto: CreateSectionDto): Promise<any> {
  //  const checkSection = await this.sectionRepository.findOneBy( {id: createSectionDto.title});
  //   if(!checkSection){
  //       throw new NotFoundException(`section not found`);
  //     }

  //     // const section = this.sectionRepository.create({
  //     //   title: createSectionDto.title,
  //     // })
  //     // await this.sectionRepository.save(section)
      
  //     const checkCoordinator = await this.facultyService.findOne(createSectionDto.coordinator_id);
  //     if(!checkCoordinator)
  //       {
  //         throw new NotFoundException(`coordinator not found`);
  //       }

  //     const coordinator = this.coordinatorRepository.create({
  //       section: {id: checkSection.id},
  //       faculty: {id: createSectionDto.coordinator_id},
  //       semester: {id: semesterId},
  //     })
  //    await this.coordinatorRepository.save(coordinator);
  //    return {
  //     coordinator: {
  //       id: checkCoordinator.id,
  //       name: checkCoordinator.name,
  //     },
  //   }
  // }

  async findAll(): Promise<any> {
    const sections = await this.sectionRepository.find();
    const coordinators = await this.coordinatorService.findAllForActiveCoordinators();
    if(!sections || sections.length === 0) {
      throw new NotFoundException('no section exists');
    }
    if(!coordinators || coordinators.length === 0) {
      throw new NotFoundException('no faculty member exists');
    }
    return coordinators;
  }

  async findOne(id: string): Promise<any> {
    const section_exist = await this.sectionRepository.findOneBy({id: id});
    if(!section_exist) {
      throw new NotFoundException(`${section_exist.title} does not exits`);
    } 
    return section_exist;
  }


  async getCoordinatorOfSameSection(id: string): Promise<any> {
    const sectionCoordinators = await this.coordinatorRepository.find({
      where: { sectionId: id },
      relations: ['section', 'faculty', 'semester'],
    });
    if(!sectionCoordinators) {
      throw new NotFoundException(`This section have no coordinator`)
    }
    return sectionCoordinators
  }
  async getCoordinatorsAndCourses(id: string): Promise<any> {
    const sectionCoordinators = await this.coordinatorRepository.find({
      where: {id},
      relations: ['section', 'faculty', 'semester'],
    });
    // Check if any coordinators exist
    if (!sectionCoordinators || sectionCoordinators.length === 0) {
      throw new NotFoundException(`No coordinators found for section with ID ${id}`);
    }
  
    // Fetch all available faculty
    const coordinators = await this.facultyService.findAll();
    if (!coordinators || coordinators.length === 0) {
      throw new NotFoundException('No faculty members exist');
    }
  
    // Map faculty details for response
    const facultyDetails = coordinators.map(coordinator => ({
      id: coordinator.id,
      name: coordinator.name,
    }));
  
    // Extract semester and section IDs from the fetched coordinators
    const semesters = sectionCoordinators.map(coord => coord.semester.id);
    const sections = sectionCoordinators.map(coord => coord.section.id);
  
    // Fetch allocated courses for all related semesters and sections
    const allocateCourses = await Promise.all(
      sectionCoordinators.map(coord =>
        this.allocateCoursesService.viewSectionCourses(coord.semester.id, coord.section.id),
      ),
    );
  
    // Construct the final response
    return {
      facultyDetails,
      allocateCourses,
      sectionCoordinators, // All coordinators for the section
    };
  }
  

  async lookUp(id: string): Promise<any> {
    const section_exist = await this.sectionRepository.findOneBy({id: id});
    if(!section_exist) {
      throw new NotFoundException(`${section_exist.title} does not exits`);
    } 
    const coordinator = await this.coordinatorService.findActiveCoordinator(id);
    return coordinator; 
  }



  async viewSection(id: string): Promise<any> {
    const sectionCoordinators = await this.getCoordinatorOfSameSection(id);
  
    // Check if any coordinators exist
    if (!sectionCoordinators || sectionCoordinators.length === 0) {
      throw new NotFoundException(`No coordinators found for section with ID ${id}`);
    }
  
    // Fetch all available faculty
    const coordinators = await this.facultyService.findAll();
    if (!coordinators || coordinators.length === 0) {
      throw new NotFoundException('No faculty members exist');
    }
  
  
    // Extract semester and section IDs from the fetched coordinators
    const semesters = sectionCoordinators.map(coord => coord.semester.id);
    const sections = sectionCoordinators.map(coord => coord.section.id);
  
    // Fetch allocated courses for all related semesters and sections
    const allocateCourses = await Promise.all(
      sectionCoordinators.map(coord =>
        this.allocateCoursesService.viewSectionCourses(coord.semester.id, coord.section.id),
      ),
    );
  
    // Construct the final response
    return {
      allocateCourses,
      sectionCoordinators, // All coordinators for the section
    };
  }

async update(id: string, updateSectionDto: UpdateSectionDto): Promise<any> {
  // Find the existing coordinator
  const coordinator = await this.coordinatorService.findOne(id);

  if (coordinator.faculty.id === updateSectionDto.coordinator_id) {
    throw new BadRequestException(`Already exist with same faculty`);
  }

  console.log('Updating coordinator:', coordinator);
  console.log(updateSectionDto.coordinator_id);

  if (updateSectionDto.coordinator_id) {
    const newFaculty = await this.facultyService.findOne(updateSectionDto.coordinator_id);

    // Close the current coordinator assignment
    await this.coordinatorRepository.update(id, {
      to_date: new Date(),
    });

    // Set the new `from_date` to the current date/time
    const newFromDate = new Date();

    // Create a new coordinator assignment with a unique `from_date`
    const newCoordinator = this.coordinatorRepository.create({
      section: coordinator.section, 
      faculty: newFaculty,          
      semester: coordinator.semester, 
      from_date: newFromDate,        
      to_date: null,                
    });

    console.log('working');

    await this.coordinatorRepository.save(newCoordinator);

    return `Coordinator updated successfully with a new assignment`;
  }

  return `No changes made as no new coordinator ID was provided`;
}

  

  

//  async remove(id: string): Promise<any> {
//     const section =  this.findOne(id);
//     await this.sectionRepository.delete(await section);
//     return `${await section} deleted successulty`;
//   }

  async removeAll(ids: string | string[]): Promise<any> {
    // Normalize `ids` to an array
    const idArray = Array.isArray(ids) ? ids : [ids];
  
    console.log('Input IDs:', idArray);
  
    // Fetch sections with matching IDs
    const sections = await this.sectionRepository.find({
      where: { id: In(idArray) },
    });
  
    console.log('Fetched Sections Count:', sections.length);
    console.log('Fetched Sections:', sections);
    console.log('Requested IDs Count:', idArray.length);
    console.log('Requested IDs:', idArray);
  
    // Check if all requested IDs exist
    const fetchedIds = sections.map(section => section.id);
    const missingIds = idArray.filter(id => !fetchedIds.includes(id));
  
    if (missingIds.length > 0) {
      console.warn('The following IDs were not found:', missingIds.join(', '));
      throw new NotFoundException(
        `The following sections were not found: ${missingIds.join(', ')}`
      );
    }
  
    // Perform hard delete
    await this.sectionRepository.delete({ id: In(fetchedIds) });
  
    console.log('Sections deleted successfully:', fetchedIds);
  
    return `Sections deleted successfully.`;
  }
  
}
