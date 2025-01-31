import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({ example: 'London', description: 'Location name' })
  name: string;

  @ApiProperty({ example: 'England', description: 'Country name' })
  country: string;

  @ApiProperty({ example: 51.52, description: 'Latitude coordinate' })
  lat: number;

  @ApiProperty({ example: -0.11, description: 'Longitude coordinate' })
  lon: number;

  @ApiProperty({ example: 15.5, description: 'Temperature in Celsius' })
  temp_c: number;

  @ApiProperty({ example: '#FFFACD', description: 'Temperature indicator color' })
  temp_color: string;

  @ApiProperty({ example: 12.5, description: 'Wind speed in km/h' })
  wind_kph: number;

  @ApiProperty({ example: '#E0F7FA', description: 'Wind speed indicator color' })
  wind_color: string;

  @ApiProperty({ example: 25, description: 'Cloud coverage percentage' })
  cloud: number;

  @ApiProperty({ example: '#FFF176', description: 'Cloud coverage indicator color' })
  cloud_color: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Country not found' })
  message: string;
}
