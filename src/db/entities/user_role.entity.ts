
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity"; 
import { Role } from "./role.entity"; 

@Entity('users_roles') 
export class UserRole {
    @PrimaryColumn({ type: 'varchar', length: 36 }) 
    userId: string;

    @PrimaryColumn({ type: 'varchar', length: 36 }) 
    roleId: string;

    @ManyToOne(() => User, (user) => user.userRole, { onDelete: 'CASCADE' })
    @JoinColumn({ referencedColumnName: 'id' }) 
    user: User;

    @ManyToOne(() => Role, (role) => role.userRole, { onDelete: 'CASCADE' })
    @JoinColumn({referencedColumnName: 'id' }) 
    role: Role;
}

