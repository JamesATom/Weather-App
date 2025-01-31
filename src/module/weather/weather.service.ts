import { Injectable, Logger, NotFoundException, HttpStatus, HttpException, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { WeatherResponseDto } from './dto/weather.dto';

interface Country {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
  q: string; 
}

interface WeatherData {
  countryId: number;
  timestamp: Date;
  temp_c: number;
  wind_kph: number;
  cloud: number;
}

@Injectable()
export class WeatherService implements OnModuleInit {
    private readonly logger = new Logger(WeatherService.name);
    private countries: Country[] = [
        { 
            id: 1, 
            name: 'Tashkent', 
            country: 'Uzbekistan', 
            lat: 41.2995, 
            lon: 69.2401,
            q: 'Tashkent,Uzbekistan'
        }
    ];
    private weatherData: WeatherData[] = [];
    private countryIdCounter = 2; 

    async onModuleInit() {
        this.logger.log('Fetching initial weather data...');
        try {
            for (const country of this.countries) {
                const weather = await this.fetchWeatherData(country.q);
                this.weatherData.push({
                    countryId: country.id,
                    timestamp: new Date(),
                    ...weather
                });
            }
            this.logger.log('Initial weather data fetched successfully');
        } catch (error) {
            this.logger.error('Failed to fetch initial weather data', error.stack);
        }
    }

    @Cron('0 0 * * *') 
    async handleCron() {
        this.logger.log('Starting daily weather update...');
        try {
            for (const country of this.countries) {
                const weather = await this.fetchWeatherData(country.q);
                this.weatherData.push({
                    countryId: country.id,
                    timestamp: new Date(),
                    ...weather
                });
            }
            this.logger.log('Weather update completed successfully');
        } catch (error) {
            this.logger.error('Failed to update weather data', error.stack);
        }
    }

    private async fetchWeatherData(query: string) {
        try {
            const response = await axios.get(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=${query}`
            );
            return {
                temp_c: response.data.current.temp_c,
                wind_kph: response.data.current.wind_kph,
                cloud: response.data.current.cloud
            };
        } catch (error) {
            this.logger.error('Failed to fetch weather data', error.stack);
            throw new HttpException('Failed to fetch weather data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getWeatherData(identifiers: (string | number)[]): Promise<WeatherResponseDto[]> {
        const weatherResponses: WeatherResponseDto[] = [];

        for (const identifier of identifiers) {
            let country = this.findCountry(identifier);
            if (!country) {
                const newCountry = await this.addNewCountry(identifier);
                if (newCountry) {
                    country = newCountry;
                } else {
                    throw new HttpException(`Country not found: ${identifier}`, HttpStatus.NOT_FOUND);
                }
            }

            const weather = this.weatherData
                .filter(w => w.countryId === country.id)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

            if (!weather) {
                throw new HttpException(`Weather data not found for ${country.name}`, HttpStatus.NOT_FOUND);
            }

            weatherResponses.push({
                name: country.name,
                country: country.country,
                lat: country.lat,
                lon: country.lon,
                temp_c: weather.temp_c,
                temp_color: this.getTemperatureColor(weather.temp_c),
                wind_kph: weather.wind_kph,
                wind_color: this.getWindColor(weather.wind_kph),
                cloud: weather.cloud,
                cloud_color: this.getCloudColor(weather.cloud)
            });
        }

        return weatherResponses;
    }

    private async addNewCountry(identifier: string | number): Promise<Country | null> {
        try {
            const query = typeof identifier === 'string' ? identifier : identifier.toString();
            const [city, country] = query.toLowerCase().split(',').map(part => part.trim());
            
            // Try searching with city only first
            const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${process.env.WEATHERAPI_KEY}&q=${encodeURIComponent(city)}`;
            const response = await axios.get(searchUrl);
    
            if (!response.data || response.data.length === 0) {
                throw new HttpException(`Location not found: ${city}`, HttpStatus.NOT_FOUND);
            }
    
            let location = country 
                ? response.data.find(loc => 
                    loc.name.toLowerCase().includes(city) && 
                    loc.country.toLowerCase().includes(country)
                  )
                : response.data[0];
    
            // If no match found with compound search, try finding exact city match
            if (!location) {
                location = response.data.find(loc => 
                    loc.name.toLowerCase() === city
                );
            }
    
            // If still no match, throw error
            if (!location) {
                throw new HttpException(
                    `No matching location found for ${query}`, 
                    HttpStatus.NOT_FOUND
                );
            }
    
            const newCountry: Country = {
                id: this.countryIdCounter++,
                name: location.name,
                country: location.country,
                lat: location.lat,
                lon: location.lon,
                q: `${location.name},${location.country}`
            };
    
            this.countries.push(newCountry);
            
            const weather = await this.fetchWeatherData(newCountry.q);
            this.weatherData.push({
                countryId: newCountry.id,
                timestamp: new Date(),
                ...weather
            });
    
            return newCountry;
        } catch (error) {
            this.logger.error(`Failed to add country: ${error.message}`);
            throw error;
        }
    }

    private findCountry(identifier: string | number): Country | undefined {
        return this.countries.find(c => 
            c.id === identifier ||
            c.name.toLowerCase() === identifier.toString().toLowerCase() ||
            c.country.toLowerCase() === identifier.toString().toLowerCase()
        );
    }

    private getTemperatureColor(temp: number): string {
        if (temp <= -30) return '#003366';
        if (temp <= -20) return '#4A90E2';
        if (temp <= -10) return '#B3DFFD';
        if (temp <= 0) return '#E6F7FF';
        if (temp <= 10) return '#D1F2D3';
        if (temp <= 20) return '#FFFACD';
        if (temp <= 30) return '#FFCC80';
        if (temp <= 40) return '#FF7043';
        return '#D32F2F';
    }

    private getWindColor(speed: number): string {
        if (speed <= 10) return '#E0F7FA';
        if (speed <= 20) return '#B2EBF2';
        if (speed <= 40) return '#4DD0E1';
        if (speed <= 60) return '#0288D1';
        return '#01579B';
    }

    private getCloudColor(cover: number): string {
        if (cover <= 10) return '#FFF9C4';
        if (cover <= 30) return '#FFF176';
        if (cover <= 60) return '#E0E0E0';
        if (cover <= 90) return '#9E9E9E';
        return '#616161';
    }
}