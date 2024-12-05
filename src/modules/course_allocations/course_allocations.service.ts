import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateCourseAllocationDto } from './dto/create-course_allocation.dto';
import { UpdateCourseAllocationDto } from './dto/update-course_allocation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseAllocation } from 'src/db/entities/course_allocation.entity';
import { In, IsNull, Repository } from 'typeorm';
import { Course } from 'src/db/entities/course.entity';
import { SemestersService } from '../semesters/semesters.service';
import { SectionsService } from '../sections/sections.service';
import { FacultiesService } from '../faculties/faculties.service';
import { CoursesService } from '../courses/courses.service';
import { RolesService } from '../roles/roles.service';
import { SectionCoordinatorsService } from '../section_coordinators/section_coordinators.service';

@Injectable()
export class CourseAllocationsService {
  constructor(
    @InjectRepository(CourseAllocation)
    private courseAllocationRepository: Repository<CourseAllocation>,
    private semesterService: SemestersService,
    @Inject(forwardRef (()=> SectionsService))
    private sectionService: SectionsService,
    private facultyService: FacultiesService,
    private coursesService: CoursesService,
    private roleService: RolesService,
    @Inject(forwardRef (()=> SectionCoordinatorsService))
    private coordinatorService: SectionCoordinatorsService
  ){}
  async viewForCreate(): Promise<any> {
    const faculties = await this.facultyService.lookUp();
    const courses = await this.coursesService.findAll();
    const roles = await this.roleService.lookUp();
    const courseAllocations = await this.courseAllocationRepository.find({
      where: {archived_on: IsNull()},
      relations: ['course', 'faculty', 'role'],
    });
  
    const coursePercentages = courses.map((course) => {
      const allocationsForCourse = courseAllocations.filter(
        (allocation) => allocation.course.id === course.id
      );
      
      let regularTeacherShare = 0;
      let markingTeacherShare = 0;
  
      allocationsForCourse.forEach((allocation) => {
        if (allocation.contribution.toLowerCase() === 'regular') {
          regularTeacherShare += allocation.teacher_share;
        } else if (allocation.contribution.toLowerCase() === 'marking') {
          markingTeacherShare += allocation.teacher_share;
        }
      });
  
      return {
        courseId: course.id,
        courseName: course.title,
        totalStudents: course.student_enrollment,
        regularTeacherShare,
        markingTeacherShare,
      };
    });
  
    return {
      faculties,
      courses,
      roles,
      coursePercentages,
    };
  }
  
  async viewForUpdate(id: string): Promise<any> {
    const faculties = await this.facultyService.lookUp();
    const courses = await this.coursesService.findAll();
    const roles = await this.roleService.lookUp();
    const courseAllocations = await this.courseAllocationRepository.find({
      where: {
      archived_on: IsNull(),
        id: id,
      },
      relations: ['course', 'faculty', 'role'],
    });
  
    const totalTeacherShare = courseAllocations.reduce((sum, allocation) => {
      return sum + allocation.teacher_share;
    }, 0);
  
    
  
    return {
      faculties,
      courses,
      roles,
      totalTeacherShare,
    };
  }
    
    
    
   

  async create(id: string, createCourseAllocationDto: CreateCourseAllocationDto): Promise<CourseAllocation> {
    const coordinator = await this.coordinatorService.findOne(id);
    const semester = coordinator.semester;
    const section = coordinator.section;
  
    await this.semesterService.findOne(semester.id);
    await this.sectionService.findOne(section.id);
  await this.facultyService.findOne(createCourseAllocationDto.faculty);
    const existingAllocation = await this.courseAllocationRepository.findOne({
      where: {
        course: { id: createCourseAllocationDto.course },
        faculty: { id: createCourseAllocationDto.faculty },
        semester: { id: semester.id },
        section: { id: section.id },
        contribution: createCourseAllocationDto.contribution,
        archived_on: IsNull(),
      },
    });
  
    if (existingAllocation) {
      throw new ConflictException('Course allocation already exists for this course, faculty, semester, and section');
    }
    const course = await this.coursesService.findOne(createCourseAllocationDto.course);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    
  console.log("working");
  
    const allocatedCourse = this.courseAllocationRepository.create({
      course: { id: createCourseAllocationDto.course },
      faculty: { id: createCourseAllocationDto.faculty },
      contribution: createCourseAllocationDto.contribution,
      role: { id: createCourseAllocationDto.role },
      teacher_share: createCourseAllocationDto.teacher_share || null,
      students_allocated: createCourseAllocationDto.allocated_students || null,
      mid_target: createCourseAllocationDto.mid_target || null,
      final_target: createCourseAllocationDto.final_target || null,
      semester: { id: semester.id }, 
      section: { id: section.id },   
    });
  
    await this.courseAllocationRepository.save(allocatedCourse);
  
    return allocatedCourse;
  }
  

   

  findAll() {
    return `This action returns all courseAllocations`;
  }

  async findOne(id: string): Promise<CourseAllocation> {
    const allocatedCourse = await this.courseAllocationRepository.findOneBy({ id: id});
    if(!allocatedCourse) {
      throw new NotFoundException(`course does not exist`);
    }
    return allocatedCourse;
  }



  async viewSectionCourses(semesterId: string, sectionId: string): Promise<any[]> {
    
    console.log(sectionId,sectionId);
    
    const courses = await this.courseAllocationRepository.find({
      where: {
        semester: {id: semesterId},
        section: {id: sectionId},
        archived_on: IsNull(),
      },
      relations: ['course', 'faculty', 'role', ]
    });
    return courses.map(course => ({
      id: course.id,
      courseId: course.course.id,
      facultyId: course.faculty.id,
      facultyName: course.faculty.name, 
      roleId: course.role.id,
      roleName: course.role.name, 
      contribution: course.contribution, 
    }));
  }

  async update(id: string, updateCourseAllocationDto: UpdateCourseAllocationDto): Promise<CourseAllocation> {
    const allocatedCourse = await this.findOne(id);
  
    const courseAllocations = await this.courseAllocationRepository.find({
      where: { course: {id: allocatedCourse.course.id} }, 
      relations: ['course', 'faculty', 'role'],
    });
  
    let totalRegularShare = 0;
    let totalMarkingShare = 0;
  
    courseAllocations.forEach((allocation) => {
      if (allocation.id !== id) {  
        if (allocation.contribution === 'regular') {
          totalRegularShare += allocation.teacher_share;
        } else if (allocation.contribution === 'marking') {
          totalMarkingShare += allocation.teacher_share;
        }
      }
    });
  
    if (updateCourseAllocationDto.teacher_share) {
      const currentAllocationType = updateCourseAllocationDto.contribution || allocatedCourse.contribution;
  
      if (currentAllocationType === 'regular') {
        const newTotalRegularShare = totalRegularShare + updateCourseAllocationDto.teacher_share;
  
        if (newTotalRegularShare > 100) {
          throw new BadRequestException("Total regular teacher allocation exceeds 100%");
        }
  
        allocatedCourse.teacher_share = updateCourseAllocationDto.teacher_share;
  
      } else if (currentAllocationType === 'marking') {
        const newTotalMarkingShare = totalMarkingShare + updateCourseAllocationDto.teacher_share;
  
        if (newTotalMarkingShare > 100) {
          throw new BadRequestException("Total marking teacher allocation exceeds 100%");
        }
  
        allocatedCourse.teacher_share = updateCourseAllocationDto.teacher_share;
      }
    }
  
    if (updateCourseAllocationDto.course) {
      allocatedCourse.course = { id: updateCourseAllocationDto.course } as any;
    }
    if (updateCourseAllocationDto.faculty) {
      allocatedCourse.faculty = { id: updateCourseAllocationDto.faculty } as any;
    }
    if (updateCourseAllocationDto.contribution) {
      allocatedCourse.contribution = updateCourseAllocationDto.contribution;
    }
    if (updateCourseAllocationDto.role) {
      allocatedCourse.role = { id: updateCourseAllocationDto.role } as any;
    }
    if (updateCourseAllocationDto.allocated_students) {
      allocatedCourse.students_allocated = updateCourseAllocationDto.allocated_students;
    }
    if (updateCourseAllocationDto.mid_target) {
      allocatedCourse.mid_target = updateCourseAllocationDto.mid_target;
    }
    if (updateCourseAllocationDto.final_target) {
      allocatedCourse.final_target = updateCourseAllocationDto.final_target;
    }
  
    await this.courseAllocationRepository.save(allocatedCourse);
  
    return allocatedCourse;
  }
  // async remove(id: string): Promise<any> {
  //   const courseAllocation = await this.courseAllocationRepository.findOne({
  //     where: { id: id },
  //     relations: ['course'],
  //   });
  
  //   if (!courseAllocation) {
  //     throw new BadRequestException(`Course allocation does not exist`);
  //   }
  
  //   if (courseAllocation.archived_on) {
  //     throw new BadRequestException(`${courseAllocation.course.id} is already archived`);
  //   }
  
  //   courseAllocation.archived_on = new Date();
  
  //   await this.courseAllocationRepository.save(courseAllocation);
  
  //   return `${courseAllocation.course.id} archived successfully`;
  // }
  

  async removeAll(ids: string | string[]): Promise<any> {
    // Normalize the input IDs to an array
    const idArray = Array.isArray(ids) ? ids : [ids];

    console.log('Input IDs:', idArray);

    // Fetch allocated courses with matching IDs
    const allocatedCourses = await this.courseAllocationRepository.find({
        where: { id: In(idArray) },
    });

    console.log('Fetched Allocated Courses Count:', allocatedCourses.length);
    console.log('Fetched Allocated Courses:', allocatedCourses);
    console.log('Requested IDs Count:', idArray.length);
    console.log('Requested IDs:', idArray);

    // Create a set of fetched IDs for easier checking
    const fetchedIds = allocatedCourses.map(course => course.id);

    // Check for missing IDs and log them
    const missingIds = idArray.filter(id => !fetchedIds.includes(id));
    if (missingIds.length > 0) {
        console.warn('The following IDs were not found:', missingIds.join(', '));
        throw new NotFoundException(`One or more courses not found: ${missingIds.join(', ')}`);
    }

    // Check for already archived courses and throw an error
    const alreadyArchived = allocatedCourses.filter(course => course.archived_on);
    if (alreadyArchived.length > 0) {
        const alreadyArchivedIds = alreadyArchived.map(course => course.id);
        throw new BadRequestException(
            `The following courses are already archived: ${alreadyArchivedIds.join(', ')}`
        );
    }

    // Perform the soft delete by updating the `archived_on` column
    const updatePromises = allocatedCourses.map(async course => {
        course.archived_on = new Date(); // Set the current date
        return this.courseAllocationRepository.save(course); // Save the updated entity
    });

    await Promise.all(updatePromises);

    return `Courses archived successfully`;
}

  
}
