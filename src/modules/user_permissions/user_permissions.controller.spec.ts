import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsController } from './user_permissions.controller';
import { UserPermissionsService } from './user_permissions.service';

describe('UserPermissionsController', () => {
  let controller: UserPermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPermissionsController],
      providers: [UserPermissionsService],
    }).compile();

    controller = module.get<UserPermissionsController>(UserPermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
