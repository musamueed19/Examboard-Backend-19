import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Designation } from 'src/db/entities/designation.entity';

@Controller('designations')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get()
  async getDesignations(
  
    @Query('search') search: string,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<{ data: Designation[]; total: number }> {
    let designation;
    
   designation = await this.designationsService.searchDesignation(search, limit, page);
       
      return designation;
    }
  
  

  @Post()
  create(@Body() createDesignationDto: CreateDesignationDto) {
    return this.designationsService.create(createDesignationDto);
  }

  @Get()
  findAll() {
    return this.designationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    return this.designationsService.update(id, updateDesignationDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.designationsService.remove(id);
  }
}
