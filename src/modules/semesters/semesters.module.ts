import { Module, forwardRef } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from 'src/db/entities/semester.entity';
import { ExamPaperSettingsModule } from '../exam_paper_settings/exam_paper_settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Semester]), ExamPaperSettingsModule],
  controllers: [SemestersController],
  providers: [SemestersService],
  exports: [SemestersService],
})
export class SemestersModule {}
