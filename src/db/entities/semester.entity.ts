import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExamPaperSetting } from "./exam_paper_setting.entity";
import { SectionCoordinator } from "./section_coordinator.entity";
import { CourseAllocation } from "./course_allocation.entity";
import { ExamDayCourseWiseStrength } from "./exam_day_course_wise_strength.entity";
import { ExamQuestion } from "./exam_question.entity";
import { DailyQbStatus } from "./daily_qb_status.entity";

@Entity('semesters')
export class Semester {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column({type: "varchar", length: 50, unique: true})
     title : string;

     @Column({type: 'date'})
     start_date: Date;

     @Column({type: 'date'})
     end_date: Date;

     @Column({type: 'date', nullable: true})
     mid_term_date: Date;

     @Column({type: 'date', nullable: true})
     final_term_date: Date;

     @Column({type: 'date', nullable: true})
     mid_term_end_date: Date;

     @Column({type: 'date', nullable: true})
     final_term_end_date: Date;

     @Column({type: 'boolean', default: false})
     is_Active: boolean;

     @Column({type: 'datetime', })
     created_on: Date;

     @Column({type: 'datetime', })
     updated_on: Date;

     @Column({type: 'datetime', nullable: true})
     archived_on: Date;



     @OneToMany(() => ExamPaperSetting, (examPaperSetting) => examPaperSetting.semester, { cascade: true })
     examPaperSettings: ExamPaperSetting[];

     @OneToMany(() => SectionCoordinator, (coordinator) => coordinator.semester, { cascade: true })
     coordinator: SectionCoordinator[];

     @OneToMany(() => CourseAllocation, (allocatedCourse) => allocatedCourse.semester, { cascade: true })
     allocatedCourse: CourseAllocation[];

     @OneToMany(() => ExamDayCourseWiseStrength, (examDay) => examDay.semester, { cascade: true })
     examDay: ExamDayCourseWiseStrength[];
     
     @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.semester, { cascade: true })
     examQuestion: ExamQuestion[];

     @OneToMany(() => DailyQbStatus, (dailyStatus) => dailyStatus.semester, { cascade: true })
     dailyStatus: DailyQbStatus[];
}
