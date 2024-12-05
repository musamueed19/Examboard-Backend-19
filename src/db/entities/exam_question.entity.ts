import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Course } from "./course.entity";
import { Semester } from "./semester.entity";
import { ExamQuestionAllocation } from "./exam_question_allocation.entity";

@Entity('exams_questions')
export class ExamQuestion {
    @Unique(["semesterId", "courseId", "exam", "questionId"])
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'course_id'})
    courseId: string;

    @ManyToOne(() => Course, (course) => course.examQuestion, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @Column({ type: 'varchar', length: 36, name: 'semester_id'})
    semesterId: string;

    @ManyToOne(() => Semester, (semester) => semester.examQuestion, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'semester_id' })
    semester: Semester;

    @Column({ type: 'int', name: 'question_id'})
    questionId: number;

    @Column({ type: 'int' })
    marks: number;

    @Column({ type: 'varchar', length: 20})
    exam: string;

    @OneToMany(() => ExamQuestionAllocation, (allocatedQuestion) => allocatedQuestion.question, { cascade: true })
    allocatedQuestion: ExamQuestionAllocation[];
}
