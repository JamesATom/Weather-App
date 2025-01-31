import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, TokenResponseDto, ErrorResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ 
        status: 201, 
        description: 'Successfully registered',
        type: TokenResponseDto 
    })
    @ApiResponse({ 
        status: 400,
        description: 'Registration failed',
        type: ErrorResponseDto
    })
    async register(@Body() userData: RegisterDto): Promise<TokenResponseDto> {
        return this.authService.register(userData);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ 
        status: 200, 
        description: 'Successfully logged in',
        type: TokenResponseDto 
    })
    @ApiResponse({ 
        status: 401,
        description: 'Invalid credentials',
        type: ErrorResponseDto
    })
    async login(@Body() credentials: LoginDto): Promise<TokenResponseDto> {
        return this.authService.login(credentials.username, credentials.password);
    }
}