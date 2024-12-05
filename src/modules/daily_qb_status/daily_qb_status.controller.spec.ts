import { Test, TestingModule } from '@nestjs/testing';
import { DailyQbStatusController } from './daily_qb_status.controller';
import { DailyQbStatusService } from './daily_qb_status.service';

describe('DailyQbStatusController', () => {
  let controller: DailyQbStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyQbStatusController],
      providers: [DailyQbStatusService],
    }).compile();

    controller = module.get<DailyQbStatusController>(DailyQbStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
