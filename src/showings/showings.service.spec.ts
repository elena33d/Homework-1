import { Test, TestingModule } from '@nestjs/testing';
import { ShowingsService } from './showings.service.js';

describe('ShowingsService', () => {
  let service: ShowingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowingsService],
    }).compile();

    service = module.get<ShowingsService>(ShowingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
