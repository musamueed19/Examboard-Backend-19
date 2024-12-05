import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SectionCoordinator } from "./section_coordinator.entity";
import { CourseAllocation } from "./course_allocation.entity";

@Entity('sections')
export class Section {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 75, unique: true})
    title: string;

    @OneToMany(() => SectionCoordinator, (coordinator) => coordinator.section, {cascade: true})
    coordinator: SectionCoordinator[];

    @OneToMany(() => CourseAllocation, (allocatedCourse) => allocatedCourse.section, {cascade: true})
    allocatedCourse: CourseAllocation[];
}
