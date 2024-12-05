import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermission } from "./role_permission.entity";
import { UserPermission } from "./user_permission.entity";

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    password: string;

    @ManyToOne(() => Permission, (permission) => permission.id, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    permission: Permission;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @Column({type: "timestamp", nullable: true})
    archived_at: Date;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission, { cascade: true })
    rolePermission: RolePermission[];
    
    @OneToMany(() => UserPermission, (userPermission) => userPermission.permission, { cascade: true })
    userPermission: UserPermission[];
}


