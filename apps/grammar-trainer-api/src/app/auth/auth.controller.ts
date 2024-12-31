import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from '../auth/guards/local.auth.guard';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { AccountLockoutGuard } from './guards/account-lockout.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestObjectUserDto } from '../users/dto/request-object-user.dto';
import { AuthGuard } from '@nestjs/passport';

/**
 * Controller for authentication-related routes.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /signup
  @Post('/signup')
  async registerUser(@Body() data: RegisterUserDto) {
    const newUser = await this.authService.registerUser(
      data.email,
      data.password
    );

    return {
      message: 'Signup successful',
      statusCode: HttpStatus.CREATED,
      user: newUser,
    };
  }

  // POST /login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  logIn(@Req() request: Request) {
    const user = this.authService.logIn(request.user as RequestObjectUserDto);

    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
      user,
    };
  }

  // GET /google
  @UseGuards(AuthGuard('google'))
  @Get('/google')
  redirectToGoogle() {
    // Guard handles logic which creates redirect URL
    // This handler is not called because Passport sends a redirect response before it is reached
  }

  // GET /google/callback
  @UseGuards(AuthGuard('google'))
  @Get('/google/callback')
  async authWithGoogle(@Req() request: Request) {
    // Add user to session object (first regenerates session, then calls passport.js's serializeUser method)
    // Login method is Promisified since the session interaction is asynchronous
    await new Promise<void>((resolve, reject) => {
      request.logIn(request.user, (err) => {
        if (err) {
          reject(
            new InternalServerErrorException(
              'Unable to authorize user with Google'
            )
          );
        }

        resolve();
      });
    });

    // Add 'createdAt' property to newly regenerated session
    // This is necessary since this handler runs after MaxSessionExpirationMiddleware
    request.session.createdAt = Date.now();

    // Sanitize user object before sending in response
    const user = this.authService.logIn(request.user as RequestObjectUserDto);

    return {
      message: 'Google authentication successful',
      statusCode: HttpStatus.OK,
      user,
    };
  }

  // GET /github
  @UseGuards(AuthGuard('github'))
  @Get('/github')
  redirectToGitHub() {
    // Guard handles logic which creates redirect URL
  }

  // GET /github/callback
  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  async authWithGitHub(@Req() request: Request) {
    // Add user to session
    await new Promise<void>((resolve, reject) => {
      request.logIn(request.user, (err) => {
        if (err) {
          reject(
            new InternalServerErrorException(
              'Unable to authorize user with GitHub'
            )
          );
        }

        resolve();
      });
    });

    // Add 'createdAt' property to newly regenerated session
    request.session.createdAt = Date.now();

    // Sanitize user object before sending in response
    const user = this.authService.logIn(request.user as RequestObjectUserDto);

    return {
      message: 'GitHub authentication successful',
      statusCode: HttpStatus.OK,
      user,
    };
  }

  // GET /profile
  @UseGuards(AuthenticatedGuard, AccountLockoutGuard)
  @Get('/profile')
  getProfile(@Req() request: Request) {
    const user = this.authService.getProfile(
      request.user as RequestObjectUserDto
    );

    return {
      message: 'Fetch successful',
      statusCode: HttpStatus.OK,
      user,
    };
  }

  // POST /logout
  @UseGuards(AuthenticatedGuard, AccountLockoutGuard)
  @Post('/logout')
  logOut(@Req() request: Request) {
    // Remove session from server
    request.logOut({ keepSessionInfo: false }, (err) => {
      if (err) {
        throw new InternalServerErrorException('Unable to log out user');
      }
    });

    // Remove the cookie from user's browser
    request.session.cookie.maxAge = 0;

    return { message: 'Logout successful', statusCode: HttpStatus.OK };
  }

  // POST /request-password-reset
  @Post('/request-password-reset')
  async requestPasswordReset(@Body() data: RequestPasswordResetDto) {
    const { message } = await this.authService.requestPasswordReset(data.email);

    return {
      message,
      statusCode: HttpStatus.OK,
    };
  }

  // POST /reset-password
  @Post('/reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    const result = await this.authService.resetPassword(
      data.token,
      data.newPassword
    );

    return {
      message: result.message,
      statusCode: HttpStatus.OK,
    };
  }
}
