import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getData(): { message: string } {
    // const config = this.configService.get<Record<string, any>>('');
    const config = this.configService.get<string>('http.baseUrl');

    console.log('Loaded Configuration:', JSON.stringify(config, null, 2));
    return { message: 'Hello API' };
  }
}
