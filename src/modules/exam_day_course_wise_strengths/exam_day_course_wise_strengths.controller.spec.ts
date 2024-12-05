import { Test, TestingModule } from '@nestjs/testing';
import { ExamDayCourseWiseStrengthsController } from './exam_day_course_wise_strengths.controller';
import { ExamDayCourseWiseStrengthsService } from './exam_day_course_wise_strengths.service';

describe('ExamDayCourseWiseStrengthsController', () => {
  let controller: ExamDayCourseWiseStrengthsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamDayCourseWiseStrengthsController],
      providers: [ExamDayCourseWiseStrengthsService],
    }).compile();

    controller = module.get<ExamDayCourseWiseStrengthsController>(ExamDayCourseWiseStrengthsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
