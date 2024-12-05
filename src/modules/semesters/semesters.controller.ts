import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { Semester } from 'src/db/entities/semester.entity';

@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Get()
  async getSemesters(
    @Query('status') status: string,
    @Query('search') search: string,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<{ data: Semester[]; total: number }> {
    let semesters;
    
    switch (status) {
      case 'Active':
        semesters = await this.semestersService.searchActiveSemester(search, limit, page);
        break;
      case 'InActive':
        semesters = await this.semestersService.searchInactiveSemester(search, limit, page);
        break;
      case 'All':
        semesters = await this.semestersService.searchAllSemesters(search, limit, page);
        break;
      default:
        throw new BadRequestException('Invalid status filter provided');
    }
  
    return semesters;
  }
  
  
  @Post('addSemester')
  create(@Body() createSemesterDto: CreateSemesterDto) {
    console.log(createSemesterDto);
    
    return this.semestersService.create(createSemesterDto);
  }

  // @Get()
  // findAll() {
  //   return this.semestersService.findAll();
  // }

  // @Get('editSemester/:id')
  // editSemester(@Param('id') id: string) {
  //   return this.semestersService.lookUp(id);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semestersService.lookUp(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semestersService.update(id, updateSemesterDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.semestersService.remove(id);
  // }

  @Delete()
  removeAll(@Query('id') id: string[]) {
    return this.semestersService.removeAll(id);
  }
}

