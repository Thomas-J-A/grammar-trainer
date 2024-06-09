import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';

// forRootAsync is used to dynamically configure the MailerModule to suit the importing module.
// The useFactory method is used to dynamically construct the configuration object for the MailerModule and enable dependencies.
// The inject property injects these dependencies into the useFactory scope.

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: configService.get<string>('mail.service'),
          host: configService.get<string>('mail.host'),
          port: configService.get<number>('mail.port'),
          secure: configService.get<boolean>('mail.secure'),
          auth: {
            user: configService.get<string>('mail.auth.user'),
            pass: configService.get<string>('mail.auth.password'),
          },
        },
        defaults: {
          from: `"His Holiness" <${configService.get<string>(
            'mail.auth.user'
          )}>`,
        },
        // TODO: Add handlebars templates
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
