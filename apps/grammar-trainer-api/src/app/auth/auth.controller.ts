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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /signup
  @Post('/signup')
  async registerUser(@Body() user: RegisterUserDto) {
    const newUser = await this.authService.registerUser(
      user.email,
      user.password
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
}
