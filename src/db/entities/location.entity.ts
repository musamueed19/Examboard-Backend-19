import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Faculty } from "./faculty.entity";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50, unique: true})
    location: string;

    @OneToMany(() => Faculty, (faculty) => faculty.location, {cascade: true})
    faculty: Faculty[];
}
