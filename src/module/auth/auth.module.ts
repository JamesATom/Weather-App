import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthLogger } from './auth.logger';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        UserModule,
        JwtAuthModule,
    ],
    providers: [AuthService, AuthLogger],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}