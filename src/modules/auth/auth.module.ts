import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { User } from 'src/db/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    UsersModule,
    RolesModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }, 
      }),
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
})
export class AuthModule {}
