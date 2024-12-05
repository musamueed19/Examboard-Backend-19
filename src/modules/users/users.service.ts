import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/db/entities/user.entity';
import { LocationsService } from '../locations/locations.service';
import { DesignationsService } from '../designations/designations.service';
import { RolesService } from '../roles/roles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Faculty } from 'src/db/entities/faculty.entity';
import { UserRole } from 'src/db/entities/user_role.entity';
import { FacultiesService } from '../faculties/faculties.service';
import { createHash } from 'crypto';
import { Role } from 'src/db/entities/role.entity';


@Injectable()

export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>, 
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly facultyService: FacultiesService,
    private readonly rolesService: RolesService,

  ) {}

  // async create(createUserDto: CreateUserDto): Promise<any> {

  //   console.log(createUserDto);
    
  //   const userExist = await this.userRepository.findOne({
  //     where: {email: createUserDto.email},
  //   })

  //   if(userExist){
  //     throw new BadRequestException('User with the same email already exist.');
  //   }

  //   const designation = await this.designationService.findOne(createUserDto.designation_id);
  //   if(!designation){
  //     throw new NotFoundException('Designation not found');
  //   }

  //   const location = await this.locationService.findOne(createUserDto.location_id);
  //   if(!location){
  //     throw new NotFoundException('Location not found');
  //   }

  //   const roles = await Promise.all(createUserDto.role_ids.map(async (roleId) => {
  //     const role = await this.rolesService.findOne(roleId);
  //     if(!role){
  //       throw new NotFoundException(`Role with id ${roleId} not found.`);
  //     }
  //     return role;
  //   }))
    


  //   const newFaculty = this.facultyRepository.create({
  //     name: createUserDto.name,
  //     email: createUserDto.email,
  //     contact_number: createUserDto.contactNumber,
  //     designation: { id: createUserDto.designation_id }, 
  //     location: { id: createUserDto.location_id },
  //   });

  //   await this.facultyRepository.save(newFaculty);

  //   const newUser = this.userRepository.create({
  //     email: createUserDto.email,
  //     password: '', 
  //     is_active: true,
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //     is_validate: true,
  //     faculty: {id: newFaculty.id},
  //   });


  //   await this.userRepository.save(newUser);
  //   const userRoles = createUserDto.role_ids.map(roleId => {
  //     const userRole = this.userRoleRepository.create({
  //       user: { id: newUser.id }, 
  //       role: { id: roleId }, 
  //     });
  //     return userRole;
  //   });


  //   await this.userRoleRepository.save(userRoles);

  

  //   const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

  //   const hashedResetCode = createHash('sha256').update(resetCode).digest('hex');
    
  //   newUser.reset_password_code = hashedResetCode;

  //   const resetCodeExpiration = new Date();
  //   resetCodeExpiration.setHours(resetCodeExpiration.getHours() + 1);
  //   newUser.reset_code_upto = resetCodeExpiration;

  //   await this.userRepository.save(newUser);

  //   // Schedule the reset of the reset_password_code after 1 hour
  //   this.scheduleResetPasswordCode(newUser.id, resetCodeExpiration);

  //   const url = `http://192.168.50.221:8080/auth/${newUser.id}/userverification`;
  
  //   const transporter = nodemailer.createTransport({
  //     host: 'localhost',
  //     port: 1025, 
  //     secure: false, 
  //   });
  
  //   const mailOptions = {
  //     from: '"YourApp" <no-reply@yourapp.com>', 
  //     to: newUser.email, 
  //     subject: 'User Verification', 
  //     text: `You are registered . Use this code: ${resetCode}`, 
  //     html: `<p>You are registered by admin. Click the link below to set your password:</p><a href="${url}">set Password</a>`, 
  //   };
  
  //   await transporter.sendMail(mailOptions);
    
  //   return { user: newUser, faculty: newFaculty };
  // }

  // private async scheduleResetPasswordCode(userId: string, expirationDate: Date) {
  //   const delay = expirationDate.getTime() - Date.now();

  //   if (delay > 0) {
  //     setTimeout(async () => {
  //       const user = await this.userRepository.findOne({ where: { id: userId } });

  //       if (user) {
  //         user.reset_password_code = null;
  //         user.reset_code_upto = null;
  //         await this.userRepository.save(user);
  //       } else {
  //         throw new NotFoundException('User not found');
  //       }
  //     }, delay);
  //   }
  // }


  async findAll(): Promise<any> {
    const users: User[] = await this.userRepository.find({
      where: {archived_at: IsNull()},
      relations: ['userRole', 'userRole.role',],
    });
  
    return users.map(user => ({
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_validate: user.is_validate,
      UserRole_id: user.userRole ? user.userRole.map(userRole => ({
        id: userRole.role.id,
        name: userRole.role.name
      })) : [],
    }));
  }
  


  async registartionData() {
    const roles =await this.rolesService.lookUp();
    return roles;
  }

  
  

  async lookUp(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { 
        id: id,
        archived_at: IsNull(),
       },
      relations: ['userRole', 'userRole.role'], 
    });
  
    if (!user) {
        throw new NotFoundException(`user not found.`);
      
    }
    return user;
  } 

  async lookUpAll(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { 
        id: id,
       },
      relations: ['userRole', 'userRole.role'], 
    });
  
    if (!user) {
        throw new NotFoundException(`user not found.`);
      
    }
    return user;
  } 

  async findOne(id: string): Promise<any | undefined> {
    const user = await this.lookUp(id);
  
  
    return {
      user: {
        id: user.id,
        email: user.email,
        UserRole_id: user.userRole ? user.userRole.map(userRole => {
          return {
            id: userRole.role.id,
            name: userRole.role.name
          };
        }) : [],
      }
    };
  }
  

  async authOneUser(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email,
        archived_at: IsNull(),
       },
      relations: ['userRole', 'userRole.role'],
    });
  
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }
  
    const faculty = await this.facultyService.findByEmail(email);
  
    // Return the user, and faculty if it exists
    return user
  }
  async authOne(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email,
        archived_at: IsNull(),
       },
      relations: ['userRole', 'userRole.role'],
    });
  
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }
  
    const faculty = await this.facultyService.findByEmail(email);
  
    // Return the user, and faculty if it exists
    return {
      user,
      faculty: faculty || null, 
    };
  }
  // async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
  //   console.log(updateUserDto);
  
  //   // Lookup user to ensure it exists
  //   const user = await this.lookUp(id);
  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found.`);
  //   }
  //   if (updateUserDto.status !== undefined) {
  //     user.is_active = updateUserDto.status;
  //     await this.userRepository.save(user);
  //     console.log("Updated user fields successfully");
  //   }
  
  //   // Delete existing user roles
  //   console.log("Updating roles for user ID:", id);
  //   await this.userRoleRepository.delete({ userId: id });
  //   console.log("Deleted existing roles for user ID:", id);
  
  //   // Add new roles to user
  //   if (updateUserDto.role_ids && updateUserDto.role_ids.length > 0) {
  //     const userRoles = updateUserDto.role_ids.map((roleId) => {
  //       return this.userRoleRepository.create({
  //         userId: id, // Explicitly set userId
  //         roleId: roleId, // Explicitly set roleId
  //       });
  //     });
  
  //     await this.userRoleRepository.save(userRoles);
  //     console.log("Updated roles successfully for user ID:", id);
  //   }
  
  
  
  //   return { message: 'User updated successfully', user };
  // }
  
  
  
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    // Fetch the user from the database
    const user = await this.lookUp(id);

    // Update roles if provided
    if (updateUserDto.role_ids && updateUserDto.role_ids.length > 0) {
        const roles = await Promise.all(
            updateUserDto.role_ids.map(async (roleId) => {
                const role = await this.rolesService.findOne(roleId);
                if (!role) {
                    throw new NotFoundException(`Role with id ${roleId} not found.`);
                }
                console.log("Found role:", role);
                return role;
            })
        );

        console.log("Updating roles for user ID:", id);
        await this.userRoleRepository.delete({ user: { id } });
        console.log("Deleted existing roles for user ID:", id);

        const userRoles = updateUserDto.role_ids.map((roleId) => {
            return this.userRoleRepository.create({
                user: { id: id },
                role: { id: roleId },
            });
        });

        await this.userRoleRepository.save(userRoles);
    }

    // Update the is_active status if provided
    if (updateUserDto.status !== undefined) {
      await this.userRepository.update(id, {
        is_active: updateUserDto.status
      });
    }


    return { message: "User updated successfully." };
}

  //   const updatedUser = await this.lookUp(id);
  
  //   return {
  //     user: {
  //       id: updatedUser.id,
  //       email: updatedUser.email,
  //       name: updatedUser.faculty ? updatedUser.faculty.name : '',
  //       is_active: updatedUser.is_active,
  //       created_at: updatedUser.created_at,
  //       updated_at: updatedUser.updated_at,
  //       is_validate: updatedUser.is_validate,
  //       contact_number: updatedUser.faculty ? updatedUser.faculty.contact_number : '',
  //       location: updatedUser.faculty?.location ? {
  //         id: updatedUser.faculty.location.id,
  //         name: updatedUser.faculty.location.location,
  //       } : null,
  //       designation: updatedUser.faculty?.designation ? {
  //         id: updatedUser.faculty.designation.id,
  //         name: updatedUser.faculty.designation.designation,
  //       } : null,
  //       UserRole_id: updatedUser.userRole ? updatedUser.userRole.map(userRole => ({
  //         id: userRole.role.id,
  //         name: userRole.role.name
  //       })) : [],
  //     }
  //   };
  // }
  
  

  // async remove(id: string): Promise<any> {
  //   const user = await this.lookUp(id);

  //   // user.archived_at = new Date();

  //   // await this.userRepository.save(user);

  //   await this.userRepository.delete(user.id);
    
  //   await this.facultyRepository.delete(user.faculty.id);

  //   await this.userRoleRepository.delete({ user: { id: user.id } });


  //   return `${user.faculty.name} successfully deleted`;

  // }

  // async removeAll(ids: string | string[]): Promise<string> {
  //   // Convert to an array if a single ID is passed
  //   const idArray = Array.isArray(ids) ? ids : [ids];
  
  //   // Fetch users with their faculty relationships based on provided IDs
  //   const users = await this.userRepository.find({
  //     where: { id: In(idArray) },
  //     relations: ['faculty'], 
  //   });
  
  //   // If some of the requested IDs are not found, throw an exception or handle as needed
  //   if (users.length !== idArray.length) {
  //     const foundUserIds = users.map(user => user.id);
  //     const missingIds = idArray.filter(id => !foundUserIds.includes(id));
  //     throw new NotFoundException(`Users not found for IDs: ${missingIds.join(', ')}`);
  //   }
  
  //   // Collect faculty IDs associated with each user (if they exist)
  //   const facultyIds = users
  //     .map(user => user.faculty?.id)
  //     .filter((id): id is string => !!id);  // Filter out undefined faculty IDs
  
  //   // Hard delete users
  //   await this.userRepository.delete(idArray);
  
  //   // Hard delete related faculty records if any faculty IDs exist
  //   if (facultyIds.length > 0) {
  //     await this.facultyRepository.delete({ id: In(facultyIds) });
  //   }
  
  //   return 'Users and related faculties deleted successfully';
  // }
    

}
