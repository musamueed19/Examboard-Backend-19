import { Module, forwardRef } from '@nestjs/common';
import { CourseAllocationsService } from './course_allocations.service';
import { CourseAllocationsController } from './course_allocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseAllocation } from 'src/db/entities/course_allocation.entity';
import { SemestersModule } from '../semesters/semesters.module';
import { SectionsModule } from '../sections/sections.module';
import { CoursesModule } from '../courses/courses.module';
import { FacultiesModule } from '../faculties/faculties.module';
import { RolesModule } from '../roles/roles.module';
import { SectionCoordinatorsModule } from '../section_coordinators/section_coordinators.module';

@Module({
  imports: [
    forwardRef(()=> SectionCoordinatorsModule), 
    TypeOrmModule.forFeature([CourseAllocation]), 
    SemestersModule, 
    forwardRef(() =>SectionsModule), 
    forwardRef(() =>CoursesModule), 
    forwardRef(() => FacultiesModule), 
    RolesModule],
  controllers: [CourseAllocationsController],
  providers: [CourseAllocationsService],
  exports: [CourseAllocationsService],
})
export class CourseAllocationsModule {}
