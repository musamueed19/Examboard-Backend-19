import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Course } from "./course.entity";
import { Semester } from "./semester.entity";

@Entity('daily_qb_statuses')
@Unique(["semesterId", "courseId", "exam", "Qid", "dateTime"]) 
export class DailyQbStatus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'course_id' })
    courseId: string;

    @ManyToOne(() => Course, (course) => course.dailyStatus, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @Column({ type: 'varchar', length: 36, name: 'semester_id' })
    semesterId: string;

    @ManyToOne(() => Semester, (semester) => semester.dailyStatus, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'semester_id' })
    semester: Semester;

    @Column({ type: 'datetime', name: 'date_time' })
    dateTime: Date;

    @Column({ type: 'int', name: 'Qid' })
    Qid: number;

    @Column({ type: 'int' })
    marks: number;

    @Column({ type: 'int' })
    total: number;

    @Column({ type: 'int' })
    marked: number;

    @Column({ type: 'int' })
    unmarked: number;

    @Column({ type: 'int' })
    cheating: number;

    @Column({ type: 'int' })
    reviewable: number;

    @Column({ type: 'varchar', length: 20 })
    exam: string;
}
