import { Module } from '@nestjs/common';
import { DailyQbStatusService } from './daily_qb_status.service';
import { DailyQbStatusController } from './daily_qb_status.controller';

@Module({
  controllers: [DailyQbStatusController],
  providers: [DailyQbStatusService],
})
export class DailyQbStatusModule {}
