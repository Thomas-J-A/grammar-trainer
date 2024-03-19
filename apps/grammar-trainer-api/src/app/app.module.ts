import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import session from 'express-session';
import passport from 'passport';
import environmentConfig from './config/configurations/environment.config';
import httpConfig from './config/configurations/http.config';
import sessionConfig from './config/configurations/session.config';
import { validate } from './config/validations/validate';

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
  load: [environmentConfig, httpConfig, sessionConfig],
};

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // TODO: Inject redis provider
  constructor(private readonly configService: ConfigService) {}

  // Apply session/passport middleware to all routes
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          // store: new RedisStore({ client: redis })
          secret: this.configService.get<string>('session.secret'),
          resave: this.configService.get<boolean>('session.resave'),
          saveUninitialized: this.configService.get<boolean>(
            'session.saveUninitialized'
          ),
          // cookie: { maxAge: 60000, sameSite: true, secure: false, httpOnly: false }
          // secure: process.env.NODE_ENV === 'production'
        }),
        passport.initialize(),
        passport.session()
      )
      .forRoutes('*');
  }
}
