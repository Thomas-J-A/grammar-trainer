import { Test, TestingModule } from '@nestjs/testing';
import { GithubStrategy } from './github.strategy';

describe('GithubStrategy', () => {
  let provider: GithubStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubStrategy],
    }).compile();

    provider = module.get<GithubStrategy>(GithubStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
