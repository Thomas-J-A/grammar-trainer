import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import session from 'express-session';
import passport from 'passport';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // TODO: Inject redis provider in constructor here
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          // store: new RedisStore({ client: redis })
          secret: 'spr-scrt-ssn-tkn',
          resave: false,
          saveUninitialized: false,
          // cookie: { maxAge: 60000, sameSite: true, secure: false, httpOnly: false }
          // secure: process.env.NODE_ENV === 'production'
        }),
        passport.initialize(),
        passport.session()
      )
      .forRoutes('*');
  }
}
