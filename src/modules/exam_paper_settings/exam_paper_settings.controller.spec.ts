import { Test, TestingModule } from '@nestjs/testing';
import { ExamPaperSettingsController } from './exam_paper_settings.controller';
import { ExamPaperSettingsService } from './exam_paper_settings.service';

describe('ExamPaperSettingsController', () => {
  let controller: ExamPaperSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamPaperSettingsController],
      providers: [ExamPaperSettingsService],
    }).compile();

    controller = module.get<ExamPaperSettingsController>(ExamPaperSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
