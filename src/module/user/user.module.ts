// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLogger } from './user.logger';

@Module({
    imports: [],
    controllers: [],
    providers: [UserService, UserLogger],
    exports: [UserService],
})
export class UserModule {}