import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/db/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
      @InjectRepository(Role)
      private roleRepository: Repository<Role>,
    ){}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll() {
    const roles = await this.roleRepository.find();
    const result = roles.map(role => ({
      id: role.id,
      password: role.name,
    }));
    return result;
  }

  async lookUp() {
    const roles = await this.roleRepository.find();
    const result = roles.map(role => ({
      id: role.id,
      password: role.name,
    }));
    return result;
  }

 async findOne(id: string):  Promise<Role | undefined> {
  const roles = await this.roleRepository.find();
  const role = roles.find(role => role.id === id);
  if (!role) {
    throw new NotFoundException('No role exist');
  }
  return role;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
