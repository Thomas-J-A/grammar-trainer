import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UsersRepository } from './users.repository';
import { SafeUserResponseDto } from './dto/safe-user-response.dto';

// NOTE: Service layer concerns: business logic

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(email: string, password: string): Promise<User> {
    // Hash password
    const hashedPassword = await this.hashPassword(password);
    const newUserData = { email, password_hash: hashedPassword };

    // Create user in database
    return await this.usersRepository.createUser(newUserData);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findUserByEmail(email);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findUserById(id);
  }

  /**
   * Encrypt user-submitted password for secure database storage.
   *
   * @param password
   * @returns {string} A hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   * Transform a database user object into a sanitized version suitable for returning in API response.
   *
   * The transformed object contains no credentials.
   *
   * @param user
   * @returns {SafeUserResponseDto} A user object without credentials.
   */
  sanitizeUser(user: User): SafeUserResponseDto {
    return plainToInstance(SafeUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
