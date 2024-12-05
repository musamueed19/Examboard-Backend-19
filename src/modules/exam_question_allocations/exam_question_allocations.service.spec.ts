import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionAllocationsService } from './exam_question_allocations.service';

describe('ExamQuestionAllocationsService', () => {
  let service: ExamQuestionAllocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamQuestionAllocationsService],
    }).compile();

    service = module.get<ExamQuestionAllocationsService>(ExamQuestionAllocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
