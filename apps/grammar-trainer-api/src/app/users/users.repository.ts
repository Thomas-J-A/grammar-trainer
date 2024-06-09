import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

// NOTE: Repository layer concerns: data access (data retrieval, storage, and query execution)

/**
 * Repository for managing users in database.
 * Provides methods to create a user, retrieve one by email or ID, and to reset a password.
 */
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user in the database.
   *
   * @param {Prisma.UserCreateInput} data - The user data to create a new user.
   * @returns {Promise<User>} A promise that resolves to the created user.
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   *  Find user in database with corresponding email address.
   *
   * @param {string} email - The email to search by in database.
   * @returns {Promise<User | null>} A promise that resolves to a user or null if not found.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find user in database with corresponding user id.
   *
   * @param {number} id - The id to search by in database.
   * @returns {Promise<User | null>} A promise that resolves to a user or null if not found.
   */
  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Update the user's password in the database.
   *
   * @param {number} id - The user's id.
   * @param {string} newPassword - The new password for the account.
   * @returns {Promise<User>} A promise that resolves to a user.
   */
  async resetPassword(id: number, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password_hash: newPassword },
    });
  }
}
