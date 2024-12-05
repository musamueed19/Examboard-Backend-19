import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateSectionCoordinatorDto } from './dto/create-section_coordinator.dto';
import { UpdateSectionCoordinatorDto } from './dto/update-section_coordinator.dto';
import { SectionCoordinator } from 'src/db/entities/section_coordinator.entity';
import { Repository, IsNull } from 'typeorm';
import { FacultiesService } from '../faculties/faculties.service';
import { SectionsService } from '../sections/sections.service';
import { SemestersService } from '../semesters/semesters.service';
import { CourseAllocationsService } from '../course_allocations/course_allocations.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SectionCoordinatorsService {
  constructor(
    @InjectRepository(SectionCoordinator)
    private sectionCoordinatorRepository: Repository<SectionCoordinator>,
    private readonly facultyService: FacultiesService,
    @Inject(forwardRef(() => SectionsService))
    private sectionService: SectionsService,
    private readonly semesterService: SemestersService,
    private readonly allocateCoursesService: CourseAllocationsService,
  ){}
  create(createSectionCoordinatorDto: CreateSectionCoordinatorDto) {
    return 'This action adds a new sectionCoordinator';
  }

 async findAll(): Promise<SectionCoordinator[]> {
  const coordinators = await this.sectionCoordinatorRepository.find({
    relations: ['section', 'faculty', 'semester'],
  });
    if(!coordinators){
      throw new NotFoundException(`no coordinators found`)
    }
    
    return coordinators;
  }

  async findAllForActiveCoordinators(): Promise<SectionCoordinator[]> {
    // Fetch coordinators where `to_date` is null
    const coordinators = await this.sectionCoordinatorRepository.find({
      where: { to_date: IsNull() }, // Ensure this is filtering properly
      relations: ['section', 'faculty', 'semester'],
    });
  
    // Check if coordinators array is empty
    if (!coordinators || coordinators.length === 0) {
      throw new NotFoundException('No active coordinators found');
    }
    console.log(coordinators);
    
  
    return coordinators; // Return active coordinators
  }
    
  async findCoordinators(ids: string[]): Promise<any[]> {
    const coordinators = await this.sectionCoordinatorRepository.find({
      where: { 
        semester: { id: ids[1] },
        section: { id: ids[2] } 
      },
      relations: ['faculty'],
    });

    
  
    if (!coordinators || coordinators.length === 0) {
      throw new NotFoundException(`No coordinators found`);
    }
  
    return coordinators.map(coordinator => ({
      id: coordinator.id,
      facultyId: coordinator.faculty.id,
      facultyName: coordinator.faculty.name,
      fromDate: coordinator.from_date, 
      toDate: coordinator.to_date,      
    }));
  }


  
  async findActiveCoordinator(sectionId: string): Promise<any> {
    const coordinator = await this.sectionCoordinatorRepository.findOne({
      where: {
        section: { id: sectionId },
        to_date: IsNull(), 
      },
      relations: ['faculty'], 
    });
  
    if (!coordinator) {
      throw new NotFoundException(`No active coordinator found for section ID: ${sectionId}`);
    }
  
    return {
      id: coordinator.id,
      facultyId: coordinator.faculty.id,
      facultyName: coordinator.faculty.name,
    };
  }
  // async lookCoordinators(ids: string[]): Promise<any> {
  //   const semesterId = ids[1];
  //   const sectionId = ids[2];
  
  //  await this.semesterService.findOne(semesterId);
  //  await this.sectionService.findOne(sectionId);
  

  //   const coordinators = await this.facultyService.findAll();
  
  //   if(!coordinators || coordinators.length === 0) {
  //     throw new NotFoundException('no faculty member exists');
  //   }
  //   const facultyDetails = coordinators.map(coordinator => ({
  //     id: coordinator.id,
  //     name: coordinator.name,
  //   }));

  //   const allocateCourses = await this.allocateCoursesService.viewSectionCourses(ids);
  
  //   return {
  //     coordinators: facultyDetails,
  //     allocateCourses,
  //   };
  // }
  async findOne(id: string): Promise<SectionCoordinator> {
    const coordinator  = await this.sectionCoordinatorRepository.findOne({
      where: {id: id},
      relations: ['section', 'faculty', 'semester'],

    })
    if(!coordinator) {
      throw new NotFoundException(`coordinator does not exist`);
    }
    return coordinator;
  }

  async update(id: string[], updateSectionCoordinatorDto: UpdateSectionCoordinatorDto): Promise<any> {
    const semesterId = id[1];
    const sectionId = id[2];
  
     await this.semesterService.findOne(semesterId);
     await this.sectionService.findOne(sectionId);
  
  
    const checkCoordinator = await this.facultyService.findOne(updateSectionCoordinatorDto.coordinator);
    if (!checkCoordinator) {
      throw new NotFoundException(`Coordinator not found`);
    }
  
    const coordinator = await this.sectionCoordinatorRepository.findOne({
      where: {
        section: { id: sectionId },
        semester: { id: semesterId },
      },
    });
  
    if (!coordinator) {
      throw new NotFoundException(`Coordinator for section ID ${sectionId} and semester ID ${semesterId} not found`);
    }
  
    if(updateSectionCoordinatorDto.coordinator) coordinator.faculty = { id: updateSectionCoordinatorDto.coordinator } as any;
    
    await this.sectionCoordinatorRepository.save(coordinator);
  
    return coordinator;
  }
  
  remove(id: number) {
    return `This action removes a #${id} sectionCoordinator`;
  }
}
