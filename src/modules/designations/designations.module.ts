import { Module } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { DesignationsController } from './designations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from 'src/db/entities/designation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Designation])],
  controllers: [DesignationsController],
  providers: [DesignationsService],
  exports: [DesignationsService],
})
export class DesignationsModule {}
