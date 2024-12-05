import { Module } from '@nestjs/common';
import { ExamPaperSettingsService } from './exam_paper_settings.service';
import { ExamPaperSettingsController } from './exam_paper_settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamPaperSetting } from 'src/db/entities/exam_paper_setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamPaperSetting])],
  controllers: [ExamPaperSettingsController],
  providers: [ExamPaperSettingsService],
  exports: [ExamPaperSettingsService],
})
export class ExamPaperSettingsModule {}
