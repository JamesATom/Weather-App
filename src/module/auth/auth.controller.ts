import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, TokenResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({
        status: 400,
        description: 'User already exists',
        schema: {
            example: {
                statusCode: 400,
                message: 'Username already exists',
                error: 'Bad Request',
                timestamp: '2024-01-31T12:00:00.000Z'
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Failed to register user',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to register user',
                error: 'Internal Server Error',
                timestamp: '2024-01-31T12:00:00.000Z'
            }
        }
    })
    async register(@Body() userData: RegisterDto): Promise<TokenResponseDto> {
        return this.authService.register(userData);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
        schema: {
            example: {
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized',
                timestamp: '2024-01-31T12:00:00.000Z'
            }
        }
    })
    async login(@Body() credentials: LoginDto): Promise<TokenResponseDto> {
        return this.authService.login(credentials.username, credentials.password);
    }
}