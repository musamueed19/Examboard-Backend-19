import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Section } from "./section.entity";
import { Faculty } from "./faculty.entity";
import { Semester } from "./semester.entity";

@Entity('sections_coordinators')
@Unique(["semesterId", "sectionId", "facultyId", "from_date" ])
export class SectionCoordinator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Section, (section) => section.coordinator, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'section_id' })
    section: Section;

    @Column({ type: 'varchar', length: 36, name: 'section_id'}) 
    sectionId: string;

    @ManyToOne(() => Faculty, (faculty) => faculty.coordinator, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'coordinator_id' })
    faculty: Faculty;

    @Column({ type: 'varchar', length: 36, name: 'coordinator_id'}) 
    facultyId: string;

    @ManyToOne(() => Semester, (semester) => semester.coordinator, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'semester_id' })
    semester: Semester;

    @Column({ type: 'varchar', length: 36, name: 'semester_id' }) 
    semesterId: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    from_date: Date;

    @Column({ type: 'date', nullable: true })
    to_date: Date;
}
