import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Faculty } from "./faculty.entity";

@Entity('designations')
export class Designation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50, unique: true})
    designation: string;

    @OneToMany(() => Faculty, (faculty) => faculty.designation, {cascade: true})
    faculty: Faculty[];
}
