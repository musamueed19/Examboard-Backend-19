import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { DesignationsModule } from '../designations/designations.module';
import { LocationsModule } from '../locations/locations.module';
import { FacultiesModule } from '../faculties/faculties.module';
import { User } from 'src/db/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from 'src/db/entities/faculty.entity';
import { Location } from 'src/db/entities/location.entity';
import { Designation } from 'src/db/entities/designation.entity';
import { Role } from 'src/db/entities/role.entity';
import { UserRolesModule } from '../user_roles/user_roles.module';
import { UserRole } from 'src/db/entities/user_role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Faculty, UserRole]),FacultiesModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
