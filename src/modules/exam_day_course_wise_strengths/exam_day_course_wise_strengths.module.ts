import { Module } from '@nestjs/common';
import { ExamDayCourseWiseStrengthsService } from './exam_day_course_wise_strengths.service';
import { ExamDayCourseWiseStrengthsController } from './exam_day_course_wise_strengths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamDayCourseWiseStrength } from 'src/db/entities/exam_day_course_wise_strength.entity';
import { SemestersModule } from '../semesters/semesters.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExamDayCourseWiseStrength]), SemestersModule, CoursesModule],
  controllers: [ExamDayCourseWiseStrengthsController],
  providers: [ExamDayCourseWiseStrengthsService],
})
export class ExamDayCourseWiseStrengthsModule {}
