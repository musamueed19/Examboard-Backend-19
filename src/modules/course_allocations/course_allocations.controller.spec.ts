import { Test, TestingModule } from '@nestjs/testing';
import { CourseAllocationsController } from './course_allocations.controller';
import { CourseAllocationsService } from './course_allocations.service';

describe('CourseAllocationsController', () => {
  let controller: CourseAllocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseAllocationsController],
      providers: [CourseAllocationsService],
    }).compile();

    controller = module.get<CourseAllocationsController>(CourseAllocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
