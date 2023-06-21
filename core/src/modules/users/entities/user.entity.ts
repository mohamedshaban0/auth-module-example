import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Length } from 'class-validator';

import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name', length: 50 })
    firstName: string;

    @Column({ name: 'last_name', length: 50 })
    lastName: string;

    @Column({ length: 16, nullable: true })
    phone: string;

    @Column({ length: 50, unique: true })
    email: string;

    @Column({
        length: 100,
    })
    @Length(8, 20)
    @Exclude()
    password: string;

    @Column({ name: 'refresh_token', default: null })
    @Exclude()
    refreshToken: string;

    @Column({ name: 'is_email_verified', default: false })
    isEmailVerified: boolean;

    @Column({ name: 'is_phone_verified', default: false })
    isPhoneVerified: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
}
