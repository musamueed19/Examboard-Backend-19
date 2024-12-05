import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { dataSourceOptions } from './db/data-source';
import { LocationsModule } from './modules/locations/locations.module';
import { RolesModule } from './modules/roles/roles.module';
import { DesignationsModule } from './modules/designations/designations.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ExamPaperSettingsModule } from './modules/exam_paper_settings/exam_paper_settings.module';
import { CourseAllocationsModule } from './modules/course_allocations/course_allocations.module';
import { SectionCoordinatorsModule } from './modules/section_coordinators/section_coordinators.module';
import { SectionsModule } from './modules/sections/sections.module';
import { ExamDayCourseWiseStrengthsModule } from './modules/exam_day_course_wise_strengths/exam_day_course_wise_strengths.module';
import { ExamQuestionAllocationsModule } from './modules/exam_question_allocations/exam_question_allocations.module';
import { ExamQuestionsModule } from './modules/exam_questions/exam_questions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    
    LocationsModule,
    DesignationsModule,
    UsersModule,
    AuthModule,
    ExamQuestionsModule,
    ExamQuestionAllocationsModule,
    FacultiesModule,
    SettingsModule,
    SemestersModule,
    CoursesModule,
    ExamPaperSettingsModule,
    SectionCoordinatorsModule,
    SectionsModule,
    CourseAllocationsModule,
    ExamDayCourseWiseStrengthsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
