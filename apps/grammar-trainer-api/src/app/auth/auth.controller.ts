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
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
      user: request.user,
    };
  }

  // GET /profile
  @UseGuards(AuthenticatedGuard)
  @Get('/profile')
  getProfile(@Req() request: Request) {
    return request.user;
  }

  // POST /logout
  @UseGuards(AuthenticatedGuard)
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
