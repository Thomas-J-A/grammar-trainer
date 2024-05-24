import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * Service responsible for implementing PassportJS's local strategy.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // Pass in any strategy-specific configurations
    super({
      usernameField: 'email',
    });
  }

  /**
   * NestJS's PassportJS verify callback implementation.
   *
   * @param {string} email - The submitted email address.
   * @param {string} password - The submitted password.
   * @returns {Promise} A promise that resolves to a user object without credentials.
   */
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    // Return value added to request object as req.user
    // Passed to serialize method under the hood if sessions are enabled
    return user;
  }
}
