import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UsersRepository } from './users.repository';
import { SafeUserResponseDto } from './dto/safe-user-response.dto';

// NOTE: Service layer concerns: business logic

/**
 * Service for managing users.
 * Provides methods for creating a user, retrieving one by email or id, hashing and resetting a password, and sanitizing a user.
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Create and store a new user instance in the database.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<User>} A promise that resolves to the created user.
   */
  async createUser(email: string, password: string): Promise<User> {
    // Hash password
    const hashedPassword = await this.hashPassword(password);
    const newUserData = { email, password_hash: hashedPassword };

    // Create user in database
    return await this.usersRepository.createUser(newUserData);
  }

  /**
   * Find user in database with corresponding email address.
   *
   * @param {string} email - The email to search by in database.
   * @returns {Promise<User | null>} A promise that resolves to a user or null if not found.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findUserByEmail(email);
  }

  /**
   * Find user in database with corresponding user id.
   *
   * @param {number} id - The id to search by in database.
   * @returns {Promise<User | null>} A promise that resolves to a user or null if not found.
   */
  async findUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findUserById(id);
  }

  /**
   * Update the user's password in the database.
   *
   * @param {number} id - The user's id.
   * @param {string} newPassword - The new password for the account.
   * @returns {Promise<User>} A promise that resolves to a user.
   */
  async resetPassword(id: number, newPassword: string): Promise<User> {
    return await this.usersRepository.resetPassword(id, newPassword);
  }

  /**
   * Encrypt user-submitted password for secure database storage.
   *
   * @param {string} password - The plaintext password to hash.
   * @returns {Promise<string>} A promise that resolves to a hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   * Transform a database user instance into a sanitized version suitable for returning in API response.
   * The transformed object contains no credentials.
   *
   * @param {User} user - A complete user instance with credentials.
   * @returns {SafeUserResponseDto} A user object without credentials.
   */
  sanitizeUser(user: User): SafeUserResponseDto {
    return plainToInstance(SafeUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
