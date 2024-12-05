import { Test, TestingModule } from '@nestjs/testing';
import { CourseAllocationsService } from './course_allocations.service';

describe('CourseAllocationsService', () => {
  let service: CourseAllocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseAllocationsService],
    }).compile();

    service = module.get<CourseAllocationsService>(CourseAllocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
