import { Test, TestingModule } from '@nestjs/testing';
import { SectionCoordinatorsController } from './section_coordinators.controller';
import { SectionCoordinatorsService } from './section_coordinators.service';

describe('SectionCoordinatorsController', () => {
  let controller: SectionCoordinatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionCoordinatorsController],
      providers: [SectionCoordinatorsService],
    }).compile();

    controller = module.get<SectionCoordinatorsController>(SectionCoordinatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
