import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Semester } from "./semester.entity";
import { Course } from "./course.entity";

@Entity('exams_days_courses_wise_strengths')
@Unique(["semesterId", "courseId", "exam", "date"]) 
export class ExamDayCourseWiseStrength {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'semester_id' })
    semesterId: string;

    @ManyToOne(() => Semester, (semester) => semester.examDay, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'semester_id' })
    semester: Semester;

    @Column({ type: 'varchar', length: 36, name: 'course_id' })
    courseId: string;

    @ManyToOne(() => Course, (course) => course.examDay, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @Column({ type: 'varchar', length: 20 })
    exam: string;

    @Column({ type: 'int' })
    num_of_students: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;
}
