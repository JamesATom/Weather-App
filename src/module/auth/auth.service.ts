import { Injectable, UnauthorizedException, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto, TokenResponseDto } from './dto/auth.dto';
import { AuthLogger } from './auth.logger';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private logger: AuthLogger,
    ) {}

    async register(userData: RegisterDto): Promise<TokenResponseDto> {
        try {
            const user = await this.userService.create(userData);
            this.logger.log(`Successfully registered user: ${userData.username}`);
            return this.generateToken(user);
        } catch (error) {
            if (error instanceof HttpException) {
                this.logger.warn(`Registration failed: ${error.message}`);
                throw error;
            }

            this.logger.error(`Unexpected error during registration: ${userData.username}`, error);
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Registration failed',
                error: 'Internal Server Error',
                timestamp: new Date().toISOString()
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(username: string, password: string): Promise<TokenResponseDto> {
        try {
            const user = await this.userService.validateUser(username, password);
            if (user) {
                this.logger.log(`User logged in successfully: ${username}`);
            } else {
                this.logger.warn(`Invalid credentials for user: ${username}`);
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }
            return user ? this.generateToken(user) : null;
        } catch (error) {
            this.logger.error(`Login failed for ${username}`, error);
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
    }

    private generateToken(user: any): TokenResponseDto {
        const payload = { username: user.username, sub: user.id };
        return {
            token: this.jwtService.sign(payload),
        };
    }
}