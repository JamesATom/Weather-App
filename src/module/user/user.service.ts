import { Injectable } from '@nestjs/common';
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
        try {
            const existingUser = this.users.find(u => u.username === userData.username);
            if (existingUser) {
                this.logger.warn(`Username already exists: ${userData.username}`);
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = {
                id: this.idCounter++,
                ...userData,
                password: hashedPassword,
            };
            this.users.push(newUser);
            this.logger.log(`User created successfully: ${userData.username}`);
            return newUser;
        } catch (error) {
            this.logger.error(`Failed to create user: ${userData.username}`, error.stack);
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