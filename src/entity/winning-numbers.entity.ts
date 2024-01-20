import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WinningNumbers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numbers: number[];

    @Column()
    round: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}