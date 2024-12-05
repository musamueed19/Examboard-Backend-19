import { Module, forwardRef } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from 'src/db/entities/section.entity';
import { SectionCoordinatorsModule } from '../section_coordinators/section_coordinators.module';
import { FacultiesModule } from '../faculties/faculties.module';
import { CourseAllocationsModule } from '../course_allocations/course_allocations.module';
import { SemestersModule } from '../semesters/semesters.module';
import { SectionCoordinator } from 'src/db/entities/section_coordinator.entity';

@Module({
  imports: [
    forwardRef(() => SectionCoordinatorsModule),
    TypeOrmModule.forFeature([Section, SectionCoordinator]), 
    forwardRef(()=> FacultiesModule),
    forwardRef(() =>CourseAllocationsModule),
    SemestersModule,
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}
