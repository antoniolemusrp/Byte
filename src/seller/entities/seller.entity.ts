import { Lead } from "src/lead/entities/lead.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Seller {

    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false, unique: true })
    name: string;

    @Column({ type: 'text', nullable: false, unique: true })
    email: string;

    @Column({ type: 'text', nullable: false, unique: true })
    identification: string;

    @Column({ type: 'text', nullable: false, unique: true })
    phone: string;

    @Column({ type: 'text', nullable: true, unique: false, default: 'activo'})
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: number;

    @Column({ type: 'timestamp', nullable: true })
    updateAt?: number;

    @OneToMany(
        () => Lead,
        (lead) => lead.id,
        { cascade: true, eager: true }
    )
    lead?: Lead;
}
