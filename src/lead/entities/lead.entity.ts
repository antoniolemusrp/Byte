import { Seller } from "src/seller/entities/seller.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lead {

    
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

    @Column({ type: 'text', nullable: false, unique: false, default: 'activo'})
    status: string;

    @Column({ type: 'text', nullable: false, unique: false, default: 'nuevo'})
    stages: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: number;

    @Column({ type: 'timestamp', nullable: true })
    updateAt?: number;

    @ManyToOne(
        () => Seller,
        ( seller ) => seller.id,
    )
    seller: Seller

}


