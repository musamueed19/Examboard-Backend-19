import { Test, TestingModule } from '@nestjs/testing';
import { ExamPaperSettingsService } from './exam_paper_settings.service';

describe('ExamPaperSettingsService', () => {
  let service: ExamPaperSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamPaperSettingsService],
    }).compile();

    service = module.get<ExamPaperSettingsService>(ExamPaperSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
