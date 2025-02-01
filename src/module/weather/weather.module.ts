import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [ScheduleModule.forRoot(), JwtAuthModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}