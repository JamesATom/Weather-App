import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserLogger } from './user.logger';

interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  password: string;
}

@Injectable()
export class UserService {
    private users: User[] = [];
    private idCounter = 1;

    constructor(private logger: UserLogger) {}

    async create(userData: Omit<User, 'id'>): Promise<User> {
        const existingUser = this.users.find(u => u.username === userData.username);
        if (existingUser) {
            this.logger.warn(`Attempted to create duplicate user: ${userData.username}`);
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'User already exists',
                error: 'Bad Request',
                timestamp: new Date().toISOString()
            }, HttpStatus.BAD_REQUEST);
        }

        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = {
                id: this.idCounter++,
                ...userData,
                password: hashedPassword,
            };
            this.users.push(newUser);
            
            this.logger.log(`Successfully created user: ${userData.username}`);
            return newUser;
        } catch (error) {
            this.logger.error(`Technical error creating user: ${userData.username}`, error);
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create user',
                error: 'Internal Server Error',
                timestamp: new Date().toISOString()
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(username: string): Promise<User | undefined> {
        const user = this.users.find(user => user.username === username);
        if (!user) {
            this.logger.warn(`User not found: ${username}`);
        }
        return user;
    }

    async validateUser(username: string, pass: string): Promise<User | null> {
        try {
            const user = await this.findOne(username);
            if (user && await bcrypt.compare(pass, user.password)) {
                this.logger.log(`User validated successfully: ${username}`);
                return user;
            }
            this.logger.warn(`Invalid credentials for user: ${username}`);
            return null;
        } catch (error) {
            this.logger.error(`Validation failed for user: ${username}`, error.stack);
            return null;
        }
    }
}