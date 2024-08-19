import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PasswordResetToken } from '@prisma/client';

/**
 * Repository for managing password reset tokens in database.
 */
@Injectable()
export class PasswordResetTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new password reset token entry in the database.
   *
   * @param {Prisma.PasswordResetTokenCreateInput} data - The data to create a new password reset token.
   * @returns {Promise<PasswordResetToken>} A promise that resolves to the created password reset token.
   */
  async createToken(
    data: Prisma.PasswordResetTokenCreateInput
  ): Promise<PasswordResetToken> {
    return this.prisma.passwordResetToken.create({ data });
  }

  /**
   * Find token entry in database by token string.
   *
   * @param {string} token - The token string to search with.
   * @returns {Promise<PasswordResetToken | null>} A promise that resolves to a password reset token or null if not found.
   */
  async findTokenByToken(token: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
  }

  /**
   * Delete token entry in database by id.
   *
   * @param {number} id - The id of the token to delete.
   * @returns {Promise<PasswordResetToken>} A promise that resolves to a password reset token entry.
   */
  async deleteToken(id: number): Promise<PasswordResetToken> {
    return this.prisma.passwordResetToken.delete({
      where: { id },
    });
  }
}
