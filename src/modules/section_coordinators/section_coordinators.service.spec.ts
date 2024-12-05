import { Test, TestingModule } from '@nestjs/testing';
import { SectionCoordinatorsService } from './section_coordinators.service';

describe('SectionCoordinatorsService', () => {
  let service: SectionCoordinatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionCoordinatorsService],
    }).compile();

    service = module.get<SectionCoordinatorsService>(SectionCoordinatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
