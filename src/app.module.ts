// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { WeatherModule } from './module/weather/weather.module';

@Module({
    imports: [
		ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
		UserModule,
		AuthModule,
		WeatherModule
	],
    controllers: [],
    providers: [],
})
export class AppModule {}
