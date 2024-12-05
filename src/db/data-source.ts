import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { ExamQuestionAllocation } from './entities/exam_question_allocation.entity';
import { ExamQuestion } from './entities/exam_question.entity';
import { DailyQbStatus } from './entities/daily_qb_status.entity';
import { SectionCoordinator } from './entities/section_coordinator.entity';
import { Section } from './entities/section.entity';
import { ExamPaperSetting } from './entities/exam_paper_setting.entity';
import { Semester } from './entities/semester.entity';
import { ExamDayCourseWiseStrength } from './entities/exam_day_course_wise_strength.entity';
import { Course } from './entities/course.entity';
import { UserPermission } from './entities/user_permission.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role_permission.entity';
import { CourseAllocation } from './entities/course_allocation.entity';
import { UserRole } from './entities/user_role.entity';
import { Faculty } from './entities/faculty.entity';
import { Designation } from './entities/designation.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { Location } from './entities/location.entity';

dotenv.config();
export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, Designation, Location, Faculty, UserRole, CourseAllocation, RolePermission, Permission, UserPermission, Course, ExamDayCourseWiseStrength, Semester, ExamPaperSetting, Section, SectionCoordinator, DailyQbStatus, ExamQuestion, ExamQuestionAllocation],
  migrations: ['dist/db/migrations/*.js'],
  seeds: ['dist/db/seeds/db_seeder.ts'],
  synchronize: true,
  logger: 'debug',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
