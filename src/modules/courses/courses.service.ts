import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/db/entities/course.entity';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ){}
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    console.log(createCourseDto);
    
    const existingCourse = await this.courseRepository.findOne({
      where: {
        id: createCourseDto.course_code,
      },
    });
    console.log(existingCourse);
    
    
    if (existingCourse) {
        throw new BadRequestException(`${existingCourse.id} already exists`);
    }

    // Create the course entity
    const course = this.courseRepository.create({
      id: createCourseDto.course_code,
      title: createCourseDto.course_title,
      type: createCourseDto.course_type,
      student_enrollment: createCourseDto.enrolled_students,
   
    });

    await this.courseRepository.save(course);

    return course;
}



  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  async findOne(id: string): Promise<Course> {
    
    return this.courseRepository.findOneBy({ id: id });
  }

  async update(updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: updateCourseDto.course_code })
    if(!course) {
      throw new BadRequestException(`${course.id} does not exist`)
    }

    if(updateCourseDto.course_code) course.id = updateCourseDto.course_code;
    if(updateCourseDto.course_title) course.title = updateCourseDto.course_title;
    if(updateCourseDto.enrolled_students) course.student_enrollment = updateCourseDto.enrolled_students;
    if(updateCourseDto.course_type) course.type = updateCourseDto.course_type;
    await this.courseRepository.save(course);

    return course;
  }



  // async remove(id: string): Promise<any> {
  //   const course = await this.courseRepository.findOneBy({ id: id })
  //   if(!course) {
  //     throw new BadRequestException(`Course does not exist`)
  //   }    
  //   await this.courseRepository.delete(id);
  //   return `${course.title} deleted successfully`;
  // }

  async removeAll(ids: string[]): Promise<any> {
  
      // const designation = await this.findOne(id);
      // await this.designationRepository.delete(designation);
      // return `${designation.designation} designation deleted successfully`;
  
      const idArray = Array.isArray(ids) ? ids : [ids];
  
      console.log('Input IDs:', idArray);
      
      const courses = await this.courseRepository.find({
          where: { id: In(idArray) },
      });
  
      // console.log('Fetched Semesters Count:', designations.length);
      // console.log('Fetched Semesters:', designations);
      // console.log('Requested IDs Count:', idArray.length);
      // console.log('Requested IDs:', idArray);
    
      const fetchedIds = courses.map(course => course.id);
  
      const missingIds = idArray.filter(id => !fetchedIds.includes(id));
      if (missingIds.length > 0) {
          console.warn('The following IDs were not found:', missingIds.join(', '));
      }
  
      const deletePromises = courses.map(async course => {
          return this.courseRepository.delete(course.id);  
      });
  
      await Promise.all(deletePromises);
  
      return `courses deleted successfully`;
  }
  async searchCourse(search?: string, limit = 10, page = 1): Promise<{ data: Course[]; total: number }> {
  const [data, total] = await this.courseRepository.findAndCount({
    where: {
      id: search ? Like(`%${search}%`) : undefined,
      
    },
    order: {
      id: 'ASC', // Sort by start_date in ascending order
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  return { data, total };
}
  

}
