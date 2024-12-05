import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}


  

  @Patch('changePassword')
  changePassword(@Param('id') id: string,@Body() changePasswordDto: ChangePasswordDto) {
    return this.settingsService.changePassword(id, changePasswordDto);
  }
  
}
