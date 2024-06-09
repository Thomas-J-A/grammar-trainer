import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { addHours } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mailer/mailer.service';
import { PasswordResetTokensService } from '../password-reset-tokens/password-reset-tokens.service';
import { SafeUserResponseDto } from '../users/dto/safe-user-response.dto';

/**
 * Service for handling authenication.
 * Provides methods for registering users, checking submitted credentials, requesting and handling password resets, and verifying passwords.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordResetTokensService: PasswordResetTokensService,
    private readonly mailerService: MailerService
  ) {}

  /**
   * Register a new user to the app.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<SafeUserResponseDto>} A promise that resolves to the created user.
   */
  async registerUser(
    email: string,
    password: string
  ): Promise<SafeUserResponseDto> {
    // Verify that a user with same email doesn't already exist
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException(`A user with email ${email} already exists`);
    }

    // Add new user to db
    const newUser = await this.usersService.createUser(email, password);

    // Sanitize and return user
    return this.usersService.sanitizeUser(newUser);
  }

  /**
   * Validate submitted credentials against those stored in db.
   * Used by PassportJS when authenticating a user during login.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<SafeUserResponseDto>} A promise that resolves to a user.
   */
  async validateUser(
    email: string,
    password: string
  ): Promise<SafeUserResponseDto> {
    // Fetch user from db
    const user = await this.usersService.findUserByEmail(email);

    // Verify user with submitted email exists
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Verify submitted password matches hashed password in db
    const isMatch = await this.verifyPassword(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Sanitize and return user
    return this.usersService.sanitizeUser(user);
  }

  /**
   *  Send a password reset link to the requesting client.
   *
   * @param {string} email - The address to send the email to.
   * @returns {Promise<{ message: string}>} A promise that resolves to an object with a success message.
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    // Fetch user record corresponding to submitted email address
    const user = await this.usersService.findUserByEmail(email);

    // Verify user with submitted email exists
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Create a unique token to identify reset password request
    const token = uuidv4();

    // Create a validity window for when user is able to use reset token to reset password
    const expiresAt = addHours(new Date(), 1); // Token valid for 1 hour

    // Store reset token and related data
    await this.passwordResetTokensService.createToken(
      token,
      user.id,
      expiresAt
    );

    // Send email to user with reset link
    await this.mailerService.sendPasswordResetLink(email, token);

    return { message: 'Password reset token generated and sent to email' };
  }

  /**
   * Update user's password in database.
   *
   * @param {string} token - The password reset token needed to verify request.
   * @param {string} newPassword - The new password for the account.
   * @returns {Promise<{ message: string}>} A promise that resolves to an object with a success message.
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Fetch reset token record from database
    const resetToken = await this.passwordResetTokensService.findTokenByToken(
      token
    );

    // Verify reset token exists and is still valid
    if (!resetToken || resetToken.expiresAt < new Date()) {
      if (resetToken) {
        // Cleanup expired token record if exists
        this.passwordResetTokensService.deleteToken(resetToken.id);
      }

      throw new BadRequestException('Invalid or expired password reset token');
    }

    // Hash new password ready for storage
    const hashedPassword = await this.usersService.hashPassword(newPassword);

    // Update user record with new password
    await this.usersService.resetPassword(resetToken.userId, hashedPassword);

    // Remove reset token record after flow has completed
    await this.passwordResetTokensService.deleteToken(resetToken.id);

    return { message: 'Password reset successfully' };
  }

  /**
   * Verify that submitted password matches the hash stored in db.
   *
   * @param {string} plainTextPassword - The submitted password.
   * @param {string} hashedPassword - The hashed password stored in the db.
   * @returns {Promise<boolean>} A promise that resolves to a boolean value.
   */
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
