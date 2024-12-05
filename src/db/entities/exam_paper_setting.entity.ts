import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Semester } from "./semester.entity";
import { Course } from "./course.entity";

@Entity('exam_papers_settings')
@Unique(["semesterId", "exam_type", "question_marks", "courseType"])
export class ExamPaperSetting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'semester_id' }) 
    semesterId: string; 
    

    @ManyToOne(() => Semester, (semester) => semester.examPaperSettings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'semester_id' }) 
    semester: Semester;

    @Column({ type: 'varchar', length: 20 })
    exam_type: string;

    @Column({ type: 'int' })
    question_marks: number;

    @Column({ type: 'int' })
    question_quantity: number;

    // @ManyToOne(() => Course, (course) => course.examPaperSettings, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'course_type' }) 
    // course: Course;

    @Column({ type: 'varchar', name: 'course_type', length: 20 }) 
    courseType: string; 
}
