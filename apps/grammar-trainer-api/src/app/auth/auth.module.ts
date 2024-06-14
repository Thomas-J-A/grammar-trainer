import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { PasswordResetTokensModule } from '../password-reset-tokens/password-reset-tokens.module';
import { MailerModule } from '../mailer/mailer.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { LoginValidationMiddleware } from './middleware/login-validation.middleware';

@Module({
  imports: [
    UsersModule,
    PasswordResetTokensModule,
    MailerModule,
    PassportModule.register({ session: true }),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  /**
   * Apply request data validation middleware to login route
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('auth/login');
  }
}
