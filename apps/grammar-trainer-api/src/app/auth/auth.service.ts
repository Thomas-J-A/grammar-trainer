import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { addHours } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mailer/mailer.service';
import { PasswordResetTokensService } from '../password-reset-tokens/password-reset-tokens.service';
import { SafeResponseUserDto } from '../users/dto/safe-response-user.dto';
import { RequestObjectUserDto } from '../users/dto/request-object-user.dto';
import { MAX_FAILED_LOGIN_ATTEMPTS, LOCKOUT_DURATION } from './auth.constants';

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
   * @returns {Promise<SafeResponseUserDto>} A promise that resolves to the created user.
   */
  async registerUser(
    email: string,
    password: string
  ): Promise<SafeResponseUserDto> {
    // Verify that a user with same email doesn't already exist
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException(`A user with email ${email} already exists`);
    }

    // Add new user to db
    const newUser = await this.usersService.createUser(email, password);

    // Sanitize and return user
    return this.usersService.sanitizeUserForResponse(newUser);
  }

  /**
   * Sanitize user ready for response.
   *
   * @param {RequestObjectUserDto} user - The req.user object.
   * @returns {SafeResponseUserDto} A sanitized user object.
   */
  logIn(user: RequestObjectUserDto): SafeResponseUserDto {
    return this.usersService.sanitizeUserForResponse(user);
  }

  /**
   * Sanitize user ready for response.
   *
   * @param {RequestObjectUserDto} user - The req.user object.
   * @returns {SafeResponseUserDto} A sanitized user object.
   */
  getProfile(user: RequestObjectUserDto): SafeResponseUserDto {
    return this.usersService.sanitizeUserForResponse(user);
  }

  /**
   * Validate submitted credentials against those stored in db.
   *
   * Used by PassportJS when authenticating a user during login.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<RequestObjectUserDto>} A promise that resolves to a user.
   */
  async validateUser(
    email: string,
    password: string
  ): Promise<RequestObjectUserDto> {
    // Fetch user from db
    const user = await this.usersService.findUserByEmail(email);

    // Verify user with submitted email exists
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Ensure user is not locked out
    if (user.lockoutExpiry && new Date() < user.lockoutExpiry) {
      throw new ForbiddenException('Account is locked. Try again later');
    }

    // Verify submitted password matches hashed password in db
    const isMatch = await this.verifyPassword(password, user.password_hash);
    if (!isMatch) {
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Reset failed login properties in user's db record when login is successful
    await this.usersService.resetFailedAttempts(user.id);

    // Sanitize and return user
    return this.usersService.sanitizeUserForRequestObject(user);
  }

  /**
   * Update user's failed login attempts and lockout status in db record.
   *
   * @param {number} userId - The id of the user attempting to log in.
   */
  async handleFailedLogin(userId: number): Promise<void> {
    // Increment the number of failed attempts registered with the user
    const updatedUser = await this.usersService.incrementFailedAttempts(userId);

    if (updatedUser.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      // Lock the user's account if they have too many failed attempts
      await this.usersService.lockAccount(userId, LOCKOUT_DURATION);
      throw new ForbiddenException('Account is locked. Try again later');
    }
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
