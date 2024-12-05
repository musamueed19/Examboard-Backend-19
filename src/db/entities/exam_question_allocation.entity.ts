import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ExamQuestion } from "./exam_question.entity";
import { Faculty } from "./faculty.entity";

@Entity('exam_questions_allocations')
@Unique(["examQuestionId", "facultyId"]) 
export class ExamQuestionAllocation {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar', length: 36, name: 'exam_question_id'}) 
    examQuestionId: string;

    @ManyToOne(() => ExamQuestion, (question) => question.allocatedQuestion, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'exam_question_id' })
    question: ExamQuestion;

    @Column({ type: 'varchar', length: 36, name: 'coordinator_id'}) 
    facultyId: string;

    @ManyToOne(() => Faculty, (faculty) => faculty.allocatedQuestion, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'faculty_id' })
    faculty: Faculty;

    @Column({ type: 'boolean', default: true })
    still_allocated: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    allocation_date: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_on: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @Column({ type: 'datetime', nullable: true })
    archived_on: Date;
}
