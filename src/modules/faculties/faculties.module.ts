import { Module, forwardRef } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { FacultiesController } from './faculties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from 'src/db/entities/faculty.entity';
import { SectionsModule } from '../sections/sections.module';
import { SectionCoordinatorsModule } from '../section_coordinators/section_coordinators.module';
import { CourseAllocationsModule } from '../course_allocations/course_allocations.module';
import { UserRole } from 'src/db/entities/user_role.entity';
import { LocationsModule } from '../locations/locations.module';
import { DesignationsModule } from '../designations/designations.module';
import { User } from 'src/db/entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => SectionCoordinatorsModule),
    forwardRef(() => SectionsModule),
    forwardRef(() => CourseAllocationsModule),
    TypeOrmModule.forFeature([Faculty, User, UserRole]),
    LocationsModule,
    DesignationsModule,
    RolesModule,
  ],
  controllers: [FacultiesController],
  providers: [FacultiesService],
  exports: [FacultiesService],
})
export class FacultiesModule {}

