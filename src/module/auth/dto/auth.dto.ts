import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  surname: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  username: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'johndoe', description: 'Registered username' })
  username: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  password: string;
}

export class TokenResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token' 
  })
  access_token: string;
}

export class ErrorResponseDto {
    @ApiProperty({ example: 400, description: 'HTTP status code' })
    statusCode: number;
  
    @ApiProperty({ example: 'User does not exist', description: 'Error message' })
    message: string;
  
    @ApiProperty({ example: 'Bad Request', description: 'Error type' })
    error: string;
  
    @ApiProperty({ example: '2024-01-31T12:00:00.000Z', description: 'Timestamp' })
    timestamp: string;
  }