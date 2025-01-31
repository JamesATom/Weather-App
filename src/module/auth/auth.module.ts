import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthLogger } from './auth.logger';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: 'your-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, AuthLogger],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}