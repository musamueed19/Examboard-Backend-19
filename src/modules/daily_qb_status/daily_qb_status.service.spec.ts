import { Test, TestingModule } from '@nestjs/testing';
import { DailyQbStatusService } from './daily_qb_status.service';

describe('DailyQbStatusService', () => {
  let service: DailyQbStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyQbStatusService],
    }).compile();

    service = module.get<DailyQbStatusService>(DailyQbStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
