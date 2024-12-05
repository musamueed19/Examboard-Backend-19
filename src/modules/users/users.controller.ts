import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
//   @Post('adduser')
//   create(@Body() createUserDto: CreateUserDto) {
//   console.log(createUserDto);
  
//   return this.usersService.create(createUserDto);
// }

@Get('editUser')
  editUser() {
    return this.usersService.registartionData();
  }

  @Get('registration')
  registration() {
    return this.usersService.registartionData();
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(id, updateUserDto);
    
    return this.usersService.update(id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }

  // @Delete()
  // removeAll(@Query('id') id: string[]) {
  //   return this.usersService.removeAll(id);
  // }
}
