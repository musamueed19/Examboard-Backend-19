import { Test, TestingModule } from '@nestjs/testing';
import { ExamDayCourseWiseStrengthsService } from './exam_day_course_wise_strengths.service';

describe('ExamDayCourseWiseStrengthsService', () => {
  let service: ExamDayCourseWiseStrengthsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamDayCourseWiseStrengthsService],
    }).compile();

    service = module.get<ExamDayCourseWiseStrengthsService>(ExamDayCourseWiseStrengthsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
