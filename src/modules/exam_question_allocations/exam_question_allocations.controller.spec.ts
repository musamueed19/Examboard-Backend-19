import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionAllocationsController } from './exam_question_allocations.controller';
import { ExamQuestionAllocationsService } from './exam_question_allocations.service';

describe('ExamQuestionAllocationsController', () => {
  let controller: ExamQuestionAllocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamQuestionAllocationsController],
      providers: [ExamQuestionAllocationsService],
    }).compile();

    controller = module.get<ExamQuestionAllocationsController>(ExamQuestionAllocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
