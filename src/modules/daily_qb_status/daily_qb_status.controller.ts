import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyQbStatusService } from './daily_qb_status.service';
import { CreateDailyQbStatusDto } from './dto/create-daily_qb_status.dto';
import { UpdateDailyQbStatusDto } from './dto/update-daily_qb_status.dto';

@Controller('daily-qb-status')
export class DailyQbStatusController {
  constructor(private readonly dailyQbStatusService: DailyQbStatusService) {}
  @Get()
  findAll() {
    return this.dailyQbStatusService.findAll();
  }


  @Get(':id/view')
  async generateStatus() {
      await this.dailyQbStatusService.viewDailyQbStatus();
  }

  // @Post()
  // create(@Body() createDailyQbStatusDto: CreateDailyQbStatusDto) {
  //   return this.dailyQbStatusService.create(createDailyQbStatusDto);
  // }

  // @Get()
  // findAll() {
  //   return this.dailyQbStatusService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyQbStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyQbStatusDto: UpdateDailyQbStatusDto) {
    return this.dailyQbStatusService.update(+id, updateDailyQbStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyQbStatusService.remove(+id);
  }
}
