import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
