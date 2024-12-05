import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity"; 
import { Permission } from "./permission.entity"; 

@Entity('users_permissions') 
export class UserPermission {
    @PrimaryColumn({ type: 'varchar', length: 36 }) 
    userId: string;

    @PrimaryColumn({ type: 'varchar', length: 36 }) 
    permissionId: string;

    @ManyToOne(() => User, (user) => user.userPermission, { onDelete: 'CASCADE' })
    @JoinColumn({ referencedColumnName: 'id' }) 
    user: User;

    @ManyToOne(() => Permission, (permission) => permission.userPermission, { onDelete: 'CASCADE' })
    @JoinColumn({ referencedColumnName: 'id' }) 
    permission: Permission;
}
