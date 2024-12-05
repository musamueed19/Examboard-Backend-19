import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CourseAllocation } from "./course_allocation.entity";
import { ExamDayCourseWiseStrength } from "./exam_day_course_wise_strength.entity";
import { ExamQuestion } from "./exam_question.entity";
import { DailyQbStatus } from "./daily_qb_status.entity";
import { ExamPaperSetting } from "./exam_paper_setting.entity";

@Entity('courses')
export class Course {
    @PrimaryColumn({type: 'varchar', length: 15, unique: true})
    id: string;

    @Column({type: 'varchar', length: 100})
    title: string;

    @Column({type: 'int'})
    student_enrollment: number;

    @Column({type: "varchar", length: 10})
    type: string;

    @OneToMany(() => CourseAllocation, (allocatedCourse) => allocatedCourse.course, {cascade: true})
    allocatedCourse: CourseAllocation[];

    @OneToMany(() => ExamDayCourseWiseStrength, (examDay) => examDay.course, {cascade: true})
    examDay: ExamDayCourseWiseStrength[];
    
    @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.course, {cascade: true})
    examQuestion: ExamQuestion[];

    @OneToMany(() => DailyQbStatus, (dailyStatus) => dailyStatus.course, {cascade: true})
    dailyStatus: DailyQbStatus[];

    // @OneToMany(() => ExamPaperSetting, (examPaperSetting) => examPaperSetting.course, { cascade: true })
    // examPaperSettings: ExamPaperSetting[];
}
