import { Injectable } from '@nestjs/common';
import { PasswordResetToken } from '@prisma/client';
import { PasswordResetTokensRepository } from './password-reset-tokens.repository';

/**
 * Service for managing password reset tokens.
 */
@Injectable()
export class PasswordResetTokensService {
  constructor(
    private readonly passwordResetTokensRepository: PasswordResetTokensRepository
  ) {}

  /**
   * Create a password reset token.
   *
   * @param {string} token - A unique token.
   * @param {number} userId - The id of the user associated with the token.
   * @param {Date} expiresAt - The expiry time of the token.
   * @returns {Promise<PasswordResetToken>} A promise that resolves to a password reset token entry.
   */
  async createToken(
    token: string,
    userId: number,
    expiresAt: Date
  ): Promise<PasswordResetToken> {
    // Create password reset token record
    const newTokenData = { token, userId, expiresAt };
    return await this.passwordResetTokensRepository.createToken(newTokenData);
  }

  /**
   * Find token entry in database by token string.
   *
   * @param {string} token - The token string to search with.
   * @returns {Promise<PasswordResetToken | null>} A promise that resolves to a password reset token or null if not found.
   */
  async findTokenByToken(token: string): Promise<PasswordResetToken | null> {
    return await this.passwordResetTokensRepository.findTokenByToken(token);
  }

  /**
   * Delete token entry in database by id.
   *
   * @param {number} id - The id of the token to delete.
   * @returns {Promise<PasswordResetToken>} A promise that resolves to a password reset token entry.
   */
  async deleteToken(id: number): Promise<PasswordResetToken> {
    return await this.passwordResetTokensRepository.deleteToken(id);
  }
}
