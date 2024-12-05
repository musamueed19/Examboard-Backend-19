import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyQbStatusDto } from './create-daily_qb_status.dto';

export class UpdateDailyQbStatusDto extends PartialType(CreateDailyQbStatusDto) {}
