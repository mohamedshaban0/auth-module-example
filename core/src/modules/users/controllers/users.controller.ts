import { Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';

import { User } from '@common/decorators';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: WinstonLogger,
        private usersService: UsersService,
    ) {}

    @Get('me')
    async getCurrentUser(@User() { userId }) {
        const user = await this.usersService.findOne({ id: userId });

        return { user };
    }

    @Patch('me')
    updateCurrentUser(@User() user) {
        this.logger.log({
            message: 'user profile updated',
            userId: user.userId,
        });
    }

    @Get('me/addresses')
    getCurrentUserAddresses(@User() user) {}

    @Post('me/addresses')
    addUserAddresses(@User() user) {
        this.logger.log({
            message: 'user added a new address',
            userId: user.userId,
        });
    }

    @Patch('me/addresses/:id')
    updateUserAddresses(@User() user, @Param() id: number) {
        this.logger.log({
            message: 'user address updated',
            userId: user.userId,
        });
    }

    @Get()
    getAllUsers() {}

    @Get(':id')
    getUser() {}
}
