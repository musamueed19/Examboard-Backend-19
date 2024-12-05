import { Module, forwardRef } from '@nestjs/common';
import { SectionCoordinatorsService } from './section_coordinators.service';
import { SectionCoordinatorsController } from './section_coordinators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionCoordinator } from 'src/db/entities/section_coordinator.entity';
import { FacultiesModule } from '../faculties/faculties.module';
import { SemestersModule } from '../semesters/semesters.module';
import { SectionsModule } from '../sections/sections.module';
import { CourseAllocationsModule } from '../course_allocations/course_allocations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SectionCoordinator]),
    forwardRef(() => FacultiesModule),
    SemestersModule,
    forwardRef(() => CourseAllocationsModule),
    forwardRef(() => SectionsModule), 
  ],
  controllers: [SectionCoordinatorsController],
  providers: [SectionCoordinatorsService],
  exports: [SectionCoordinatorsService],
})
export class SectionCoordinatorsModule {}
