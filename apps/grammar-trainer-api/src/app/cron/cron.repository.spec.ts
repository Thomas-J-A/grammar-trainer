import { Test, TestingModule } from '@nestjs/testing';
import { CronRepository } from './cron.repository';

describe('Cron', () => {
  let provider: CronRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronRepository],
    }).compile();

    provider = module.get<CronRepository>(CronRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
