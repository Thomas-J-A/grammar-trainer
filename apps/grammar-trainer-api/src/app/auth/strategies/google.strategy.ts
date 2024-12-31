import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * Service responsible for implementing PassportJS's Google strategy.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    // Strategy-specific configurations
    super({
      clientID: configService.get<string>('oauth.google.id'),
      clientSecret: configService.get<string>('oauth.google.secret'),
      callbackURL: `${configService.get<string>(
        'http.baseUrl'
      )}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  /**
   * NestJS's PassportJS verify callback implementation.
   *
   * @param {string} accessToken - The token used to authenticate on user's behalf with Google.
   * @param {string | undefined} refreshToken - The token used to refresh credentials.
   * @param {object} profile - The authenticating user's Google profile details.
   * @param {function} done - A callback which authenticates the user.
   * @returns {Promise}
   */
  async validate(
    accessToken: string,
    refreshToken: string | undefined,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    // Extract details about user from Google profile
    const { id: providerId, emails, provider } = profile;
    const email = emails[0].value;
    const userDetails = { email, provider, providerId };

    // Find or create user in database
    const user = await this.authService.findOrCreateOauthUser(userDetails);

    // Attach user to request object
    done(null, user);
  }
}
