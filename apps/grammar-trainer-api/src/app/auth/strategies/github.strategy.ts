import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * Service responsible for implementing PassportJS's GitHub strategy.
 */
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('oauth.github.id'),
      clientSecret: configService.get<string>('oauth.github.secret'),
      callbackURL: `${configService.get<string>(
        'http.baseUrl'
      )}/api/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  /**
   * NestJS's PassportJS verify callback implementation.
   *
   * @param {string} accessToken - The token used to authenticate on user's behalf with GitHub.
   * @param {string} refreshToken - The token used to refresh credentials.
   * @param {object} profile - The authenticating user's GitHub profile details.
   * @param {function} done - A callback which authenticates the user.
   * @returns {Promise}
   */
  async validate(
    accessToken: string,
    refreshToken: string | undefined,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    // Extract details about user from GitHub profile
    const { id: providerId, emails, provider } = profile;
    const email = emails[0].value;

    // Ensure the provider value is 'github' to comply with service method's expected parameter types
    if (!isGithubProvider(provider)) {
      throw new InternalServerErrorException(
        `Invalid OAuth provider. Expected 'github', received '${provider}'`
      );
    }

    // Find or create user in database
    const userDetails = { email, provider, providerId };
    const user = await this.authService.findOrCreateOauthUser(userDetails);

    // Attach user to request object
    done(null, user);
  }
}

/**
 * Type guard to ensure the provider value is the string 'github'.
 *
 * @param {string} provider - The provider value provided by passport-github2 library.
 * @returns {boolean}
 */
const isGithubProvider = (provider: string): provider is 'github' => {
  return provider === 'github';
};
