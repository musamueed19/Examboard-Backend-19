import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Role } from "./role.entity"; 
import { Permission } from "./permission.entity"; 

@Entity('roles_permissions') 
export class RolePermission {
    @PrimaryColumn({ type: 'varchar', length: 36 }) 
    roleId: string;

    @PrimaryColumn({ type: 'varchar', length: 36 }) 
    permissionId: string;

    @ManyToOne(() => Role, (role) => role.rolePermission, { onDelete: 'CASCADE' })
    @JoinColumn({ referencedColumnName: 'id' }) 
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolePermission, { onDelete: 'CASCADE' })
    @JoinColumn({  referencedColumnName: 'id' }) 
    permission: Permission;
}
