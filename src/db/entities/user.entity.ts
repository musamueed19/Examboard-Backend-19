import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Faculty } from "./faculty.entity";
import { UserPermission } from "./user_permission.entity";
import { UserRole } from "./user_role.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', unique: true})
    email: string;

    @Column({type: 'varchar'})
    password: string;

    @Column({type: 'boolean', default: false})
    is_active: boolean;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @Column({type: 'datetime', nullable: true})
    archived_at: Date;

    @Column({type: 'boolean', default: false})
    is_validate: boolean;

    @Column({type: 'varchar', nullable: true})
    reset_password_code: string;

    @Column({type: 'datetime', nullable: true})
    reset_code_upto: Date;

    @Column({type: 'varchar', nullable: true})
    login_token: string;


    @OneToMany(() => UserPermission, (userPermission) => userPermission.permission, { cascade: true })
    userPermission: UserPermission[];

    @OneToMany(() => UserRole, (userRole) => userRole.user, { cascade: true })
    userRole: UserRole[];
}