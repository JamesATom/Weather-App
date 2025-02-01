import { Controller, Get, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/auth.guard';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './dto/weather.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Weather')
@ApiBearerAuth()
@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get()
    @ApiOperation({
        summary: 'Get weather data for locations',
        description: `Retrieves current weather data for specified locations. 
            Locations can be provided in format: "city" or "city,country".
            Example: "london,uk" or "paris,france"`,
    })
    @ApiQuery({
        name: 'countries',
        type: [String],
        required: true,
        description: 'List of locations to get weather data for',
        examples: {
            single: {
                value: ['london,uk'],
                description: 'Single location query'
            },
            multiple: {
                value: ['london,england', 'paris,france'],
                description: 'Multiple locations query'
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Weather data retrieved successfully',
        type: WeatherResponseDto,
        isArray: true
    })
    @ApiResponse({
        status: 404,
        description: 'Location not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Location not found: london',
                error: 'Not Found'
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to fetch weather data',
                error: 'Internal Server Error'
            }
        }
    })
    async getWeather(@Query('countries') countries: string[]): Promise<WeatherResponseDto[]> {
        if (typeof countries === 'string') {
            countries = [countries];
        }
        return this.weatherService.getWeatherData(countries);
    }
}