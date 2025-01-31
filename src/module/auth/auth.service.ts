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
            this.logger.log(`User registered successfully: ${userData.username}`);
            return this.generateToken(user);
        } catch (error) {
            this.logger.error(`Registration failed for ${userData.username}`, error.stack);
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
            access_token: this.jwtService.sign(payload),
        };
    }
}