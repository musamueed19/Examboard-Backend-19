import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/db/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {id: id},
    })

    if(!user){
      throw new NotFoundException('User does not exist.');
    }
    return user;
  }


  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<any> {
    const user = await this.findOne(id);

   

    if(user.password !== changePasswordDto.currentPassword) {
          throw new UnauthorizedException('Current password is incorrect');
    }
      user.password = changePasswordDto.newPassword;
      await this.userRepository.save(user);
    return `password updated successfully`;
  }

}
