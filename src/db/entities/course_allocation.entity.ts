import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Course } from "./course.entity";
import { Faculty } from "./faculty.entity";
import { Semester } from "./semester.entity";
import { Section } from "./section.entity";
import { Role } from "./role.entity";

@Entity('courses_allocations')
@Unique(["semester", "section", "course", "faculty"])
export class CourseAllocation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Course, (course) => course.allocatedCourse, {onDelete: "CASCADE"})
    @JoinColumn({name: 'course_id'})
    course: Course;

    @ManyToOne(() => Faculty, (faculty) => faculty.allocatedCourse, {onDelete: "CASCADE"})
    @JoinColumn({name: 'faculty_id'})
    faculty: Faculty;

    @ManyToOne(() => Semester, (semester) => semester.allocatedCourse, {onDelete: "CASCADE"})
    @JoinColumn({name: 'semester_id'})
    semester: Semester;

    @ManyToOne(() => Section, (section) => section.allocatedCourse, {onDelete: "CASCADE"})
    @JoinColumn({name: 'section_id'})
    section: Section;

    @Column({type: 'varchar', length: 20})
    contribution: string;
    
    @ManyToOne(() => Role, (role) => role.allocatedCourse, {onDelete: "CASCADE"})
    @JoinColumn({name: 'role_id'})
    role: Role;

    @Column({type: 'float'})
    teacher_share: number;

    @Column({type: 'int'})
    students_allocated: number;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_on: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updated_on: Date;

    @Column({type: 'datetime', nullable: true})
    archived_on: Date;

    @Column({type: 'int', nullable: true})
    mid_target: number;

    @Column({type: 'int', nullable: true})
    final_target: number;
}
