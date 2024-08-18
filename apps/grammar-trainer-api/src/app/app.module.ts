import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './cron/cron.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PasswordResetTokensModule } from './password-reset-tokens/password-reset-tokens.module';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { RedisClientType } from 'redis';
import { RedisModule } from './redis/redis.module';
import { REDIS_CLIENT } from './redis/redis.contants';
import passport from 'passport';
import environmentConfig from './config/configurations/environment.config';
import httpConfig from './config/configurations/http.config';
import sessionConfig from './config/configurations/session.config';
import cacheConfig from './config/configurations/cache.config';
import databaseConfig from './config/configurations/database.config';
import mailConfig from './config/configurations/mail.config';
import { validate } from './config/validations/validate';
import { MaxSessionExpirationMiddleware } from './global-middleware/max-session-expiration.middleware';

// Options to configure ConfigModule
const configModuleOptions: ConfigModuleOptions = {
  // Validate loaded env vars
  validate,

  // Make module globally available
  isGlobal: true,

  // Cache process.env value in memory when accessing through ConfigService
  cache: true,

  // Fetch environment-specific .env file
  envFilePath: `.env.${process.env.NODE_ENV}`,

  // Extend configuration beyond just env vars, and modify format with nesting for intuitive access
  load: [
    environmentConfig,
    httpConfig,
    sessionConfig,
    cacheConfig,
    databaseConfig,
    mailConfig,
  ],
};

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    ScheduleModule.forRoot(),
    CronModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PasswordResetTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly configService: ConfigService
  ) {}

  /**
   * Apply session/passport middleware to all routes
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new RedisStore({ client: this.redisClient }),
          secret: this.configService.get<string>('session.secret'),
          rolling: this.configService.get<boolean>('session.rolling'),
          resave: this.configService.get<boolean>('session.resave'),
          saveUninitialized: this.configService.get<boolean>(
            'session.saveUninitialized'
          ),
          cookie: {
            maxAge: 300000, // TODO: get value from config - this.configService.get<number>('session.maxAge'). Currently a bug.
            sameSite: true,
            httpOnly: true,
            secure:
              this.configService.get<string>('environment.mode') ===
              'production',
          },
        }),
        MaxSessionExpirationMiddleware,
        passport.initialize(),
        passport.session()
      )
      .forRoutes('*');
  }
}

/**
 * NOTE: even if saveUninitialized is set to false, passport.session middleware seems
 * to touch the session and cause it to be created/updated even when uninitialized.
 * The flow seems to be client req => express-session creates/finds session =>
 * passport touches session => express-session saves updated session to store =>
 * session is removed from store when expired
 *
 * NOTE: cookies are created by express-session, and sent regardless of auth status (to cover various use cases)
 *
 * NOTE: express-session updates the expires value of the cookie on each request to ensure sessions remain active
 * as long as the user is active (internal resetMaxAge method)
 *
 * NOTE: to prevent session fixation, upon logging in successfully the session id is replaced (passport calls session.regenerate?).
 * It is also replaced in the client's browser.
 */
