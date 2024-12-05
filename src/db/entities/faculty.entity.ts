import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.entity";
import { Designation } from "./designation.entity";
import { CourseAllocation } from "./course_allocation.entity";
import { SectionCoordinator } from "./section_coordinator.entity";
import { ExamQuestionAllocation } from "./exam_question_allocation.entity";
import { User } from "./user.entity";

@Entity('faculties')
export class Faculty {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 100})
    name: string;

    @ManyToOne(() => Location, (location) => location.faculty, {onDelete: "CASCADE"})
    @JoinColumn({name: 'location_id'})
    location: Location;

    @Column({type: 'varchar', length: 20})
    contact_number: string;

    @ManyToOne(() => Designation, (designation) => designation.faculty, {onDelete: "CASCADE"})
    @JoinColumn({name: 'designation_id'})
    designation: Designation;

    @OneToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({name: 'user_id' })
    user: User;

    @Column({type: 'datetime', nullable: true})
    archived_at: Date;

    @Column({type: 'varchar', unique: true})
    email: string;


    @OneToMany(() => CourseAllocation, (allocatedCourse) => allocatedCourse.faculty, {cascade: true})
    allocatedCourse: CourseAllocation[];

    @OneToMany(() => SectionCoordinator, (coordinator) => coordinator.faculty, {cascade: true})
    coordinator: SectionCoordinator[];

    @OneToMany(() => ExamQuestionAllocation, (allocatedQuestion) => allocatedQuestion.faculty, {cascade: true})
    allocatedQuestion: ExamQuestionAllocation[];
}
