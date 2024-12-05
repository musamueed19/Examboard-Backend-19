import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourseAllocation } from "./course_allocation.entity";
import { RolePermission } from "./role_permission.entity";
import { UserRole } from "./user_role.entity";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 30})
    name: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @Column({type: 'datetime', nullable: true})
    archived_at: Date;

    @Column({type: 'varchar', length: 30})
    category: string;

    @OneToMany(() => CourseAllocation, (allocatedCourse) => allocatedCourse.role, {cascade: true})
    allocatedCourse: CourseAllocation[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, { cascade: true })
    rolePermission: RolePermission[];

    @OneToMany(() => UserRole, (userRole) => userRole.role, { cascade: true })
    userRole: UserRole[];
    

}
