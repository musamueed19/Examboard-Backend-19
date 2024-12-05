import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { Faculty } from 'src/db/entities/faculty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { UserRole } from 'src/db/entities/user_role.entity';
import { LocationsService } from '../locations/locations.service';
import { DesignationsService } from '../designations/designations.service';
import { RolesService } from '../roles/roles.service';
import { createHash } from 'crypto';
import * as nodemailer from 'nodemailer';
import { UsersService } from '../users/users.service';


@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private readonly locationService: LocationsService,
    private readonly designationService: DesignationsService,
    private readonly rolesService: RolesService,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<any> {
    console.log(createFacultyDto);
    
   const faculty =  await this.findByEmail(createFacultyDto.email);
   const user = await this.userRepository.findOne({
    where: {
      email: createFacultyDto.email,
    }
   })
   if (faculty) {
    throw new NotFoundException(`faculty ${faculty.name} already exist `);
  }
  
  if (user) {
    throw new NotFoundException(`user ${user.email} already exist `);
  }
  await this.designationService.findOne(createFacultyDto.designation_id);
 
    await this.locationService.findOne(createFacultyDto.location_id);    

    await Promise.all(createFacultyDto.role_ids.map(async (roleId) => {
      const role = await this.rolesService.findOne(roleId);
      if(!role){
        throw new NotFoundException(`Role with id ${roleId} not found.`);
      }
      return role;
    }))
    
    
      const newUser = this.userRepository.create({
      email: createFacultyDto.email,
      is_active: createFacultyDto.status,
      password: '', 
      created_at: new Date(),
      updated_at: new Date(),
    })
    
    await this.userRepository.save(newUser);

    const newFaculty = this.facultyRepository.create({
      name: createFacultyDto.name,
      email: createFacultyDto.email,
      contact_number: createFacultyDto.contactNumber,
      designation: { id: createFacultyDto.designation_id },
      location: { id: createFacultyDto.location_id },
      user: {id: newUser.id},
    });

    await this.facultyRepository.save(newFaculty);

    await this.userRepository.save(newUser);
    const userRoles = createFacultyDto.role_ids.map(roleId => {
      const userRole = this.userRoleRepository.create({
        user: { id: newUser.id }, 
        role: { id: roleId }, 
      });
      return userRole;
    });

    await this.userRoleRepository.save(userRoles);
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    const hashedResetCode = createHash('sha256').update(resetCode).digest('hex');
    
    newUser.reset_password_code = hashedResetCode;

    const resetCodeExpiration = new Date();
    resetCodeExpiration.setHours(resetCodeExpiration.getHours() + 1);
    newUser.reset_code_upto = resetCodeExpiration;

    await this.userRepository.save(newUser);

    // Schedule the reset of the reset_password_code after 1 hour
    this.scheduleResetPasswordCode(newUser.id, resetCodeExpiration);

    const url = `http://localhost:3001/auth/${newUser.id}/userverification`;
  
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025, 
      secure: false, 
    });
  
    const mailOptions = {
      from: '"YourApp" <no-reply@yourapp.com>', 
      to: newUser.email, 
      subject: 'User Verification', 
      text: `You are registered . Use this code: ${resetCode}`, 
      html: `<p>You are registered by admin. Click the link below to set your password:</p><a href="${url}">set Password</a>`, 
    };
  
    await transporter.sendMail(mailOptions);
    
    return { user: newUser, faculty: newFaculty };

 }


 private async scheduleResetPasswordCode(userId: string, expirationDate: Date) {
  const delay = expirationDate.getTime() - Date.now();

  if (delay > 0) {
    setTimeout(async () => {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (user) {
        user.reset_password_code = null;
        user.reset_code_upto = null;
        await this.userRepository.save(user);
      } else {
        throw new NotFoundException('User not found');
      }
    }, delay);
  }
}
async updateData() {
  const locations = await this.locationService.lookUp();
  const designations =await this.designationService.lookUp();
  return {locations, designations};
}

  async registartionData() {
    const locations = await this.locationService.lookUp();
    const designations =await this.designationService.lookUp();
    const roles =await this.rolesService.lookUp();
    return {locations, designations, roles};
  }
  async findByEmail(email: string): Promise<Faculty> {
    const faculty = await this.facultyRepository.findOne({
      where: {
        email: email,
      },
      relations: ['designation', 'location', 'user', 'user.userRole' , 'user.userRole.role']
    });

   
    return faculty;
  }


async findAll(): Promise<any[]> {
  const faculty = await this.facultyRepository.find({
    where: { archived_at: IsNull() },
    relations: ['location', 'designation', 'user', 'user.userRole', 'user.userRole.role'],
  });

  if (!faculty || faculty.length === 0) {
    throw new NotFoundException('No faculty exists');
  }

  // Transform the result to exclude sensitive fields
  return faculty.map(f => ({
    id: f.id,
    name: f.name,
    email: f.email,
    contact_number: f.contact_number,
    location: f.location ? f.location.location : null,
    designation: f.designation ? f.designation.designation : null,
    user: {
      id: f.user.id,
      email: f.user.email,
      is_active: f.user.is_active,
      created_at: f.user.created_at,
      updated_at: f.user.updated_at,
      is_validate: f.user.is_validate,
      roles: f.user.userRole?.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        category: ur.role.category,
      })),
    },
  }));
}
async findAllWithSearchAndPagination(
  search?: string,
  limit = 10,
  page = 1,
): Promise<{ data: any[]; total: number }> {
  // Trim quotes from the search query
  const sanitizedSearch = search?.replace(/^"|"$/g, '').trim();

  // Build the query to search for either name or email
  const whereCondition = sanitizedSearch
    ? [
        { name: ILike(`%${sanitizedSearch}%`), archived_at: IsNull() },
        { email: ILike(`%${sanitizedSearch}%`), archived_at: IsNull() },
      ]
    : { archived_at: IsNull() };

  const [faculty, total] = await this.facultyRepository.findAndCount({
    where: whereCondition,
    relations: [
      'location',
      'designation',
      'user',
      'user.userRole',
      'user.userRole.role',
    ],
    order: {
      name: 'ASC', // Sorting by name
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  if (!faculty || faculty.length === 0) {
    throw new NotFoundException('No faculty exists');
  }

  // Transform the result to exclude sensitive fields
  const transformedFaculty = faculty.map(f => ({
    id: f.id,
    name: f.name,
    email: f.email,
    contact_number: f.contact_number,
    location: f.location ? f.location.location : null,
    designation: f.designation ? f.designation.designation : null,
    user: {
      id: f.user.id,
      email: f.user.email,
      is_active: f.user.is_active,
      created_at: f.user.created_at,
      updated_at: f.user.updated_at,
      is_validate: f.user.is_validate,
      roles: f.user.userRole?.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        category: ur.role.category,
      })),
    },
  }));

  return { data: transformedFaculty, total };
}




  async lookUp(): Promise<Faculty[]> {
    const faculty = await this.findAll();
   
    return faculty;
  }

  async findOne(id: string): Promise<Faculty> {
    const faculty = await this.facultyRepository.findOne({
      where: { 
        id: id,
       },
      relations: ['location', 'designation', 'user', 'user.userRole' , 'user.userRole.role'],
    });
    if (!faculty) {
      throw new NotFoundException(`faculty not found`);
    }
    return faculty;
  }

  async findAssignedFaculty(courseId: string): Promise<Faculty[]> {
    return this.facultyRepository
      .createQueryBuilder('faculty')
      .innerJoin('faculty.allocatedCourse', 'allocatedCourse')
      .where('allocatedCourse.course_id = :courseId', { courseId })
      .getMany();
  }
  

  async update(
    id: string,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    const faculty = await this.findOne(id);

    
    if (updateFacultyDto.name) faculty.name = updateFacultyDto.name;
    if (updateFacultyDto.contactNumber) faculty.contact_number = updateFacultyDto.contactNumber;
    if (updateFacultyDto.designation_id) faculty.designation = { id: updateFacultyDto.designation_id } as any;
    if (updateFacultyDto.location_id)faculty.location = { id: updateFacultyDto.location_id } as any;
    await this.facultyRepository.save(faculty);
    return faculty;
  }

  // async remove(id: string): Promise<any> {
  //   const faculty = await this.facultyRepository.findOneBy({ id: id });
  //   if (!faculty) {
  //     throw new NotFoundException(`faculty mot found`);
  //   }
  //   await this.facultyRepository.delete(id);
  //   return `${faculty.name} deleted successfully`;
  // }

  async removeAll(ids: string[]): Promise<any> {
    const idArray = Array.isArray(ids) ? ids : [ids];

    // Fetch faculties based on provided IDs
    const faculties = await this.facultyRepository.find({
        where: { id: In(idArray) },
        relations: ['user'], // Include related user details
    });

    // Check if all requested faculties are found
    if (faculties.length !== idArray.length) {
        const foundFacultiesIds = faculties.map(faculty => faculty.id);
        const missingIds = idArray.filter(id => !foundFacultiesIds.includes(id));
        throw new NotFoundException(`Faculties not found for IDs: ${missingIds.join(', ')}`);
    }

    // Collect user IDs associated with faculties
    const userIds = faculties
        .map(faculty => faculty.user?.id)
        .filter((id): id is string => !!id); // Filter out undefined user IDs

    const currentDate = new Date();

    // Soft delete faculties by updating `archived_at`
    for (const faculty of faculties) {
        faculty.archived_at = currentDate;
        await this.facultyRepository.save(faculty);
    }

    // Soft delete users by updating `archived_at` if any associated users exist
    if (userIds.length > 0) {
        const users = await this.userRepository.find({
            where: { id: In(userIds) },
        });

        for (const user of users) {
            user.archived_at = currentDate;
            await this.userRepository.save(user);
        }

       
    }

    return {message: 'Users and related faculties soft-deleted successfully'};
}

  async searchFaculties(term: string): Promise<Faculty[]> {
    // Search only by title using TypeORM's `ILike` for case-insensitive matches
    const searchResults = await this.facultyRepository.find({
      where: { 
        name: ILike(`%${term}%`),
        archived_at: IsNull(),
      },
    });
    console.log(term);

    console.log(searchResults);

    if (searchResults.length === 0) {
      throw new NotFoundException(
        `No Faculties matching the search term: ${term}`,
      );
    }

    return searchResults;
  }
}
