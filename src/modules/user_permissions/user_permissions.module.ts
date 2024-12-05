import { Module } from '@nestjs/common';
import { UserPermissionsService } from './user_permissions.service';
import { UserPermissionsController } from './user_permissions.controller';

@Module({
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService],
})
export class UserPermissionsModule {}
