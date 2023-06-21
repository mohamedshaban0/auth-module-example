import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(user: Partial<User>): Promise<User> {
        const createdUser = this.repo.create(user);
        return this.repo.save(createdUser);
    }

    findOne(conditions: any): Promise<User | undefined> {
        return this.repo.findOne({
            where: conditions,
        });
    }

    updateOne(conditions: any, data: any) {
        return this.repo.update(conditions, data);
    }

    checkIfEmailExist(email: string) {
        return this.repo.exist({ where: { email } });
    }
}
