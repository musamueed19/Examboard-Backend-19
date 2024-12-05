import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreatePasswordDto } from './dto/create-password.dto';
import { ChangePasswordDto } from '../settings/dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    console.log(loginAuthDto)
    return this.authService.login(loginAuthDto);
  }

  @Post('forgotPassword/:email')
  forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('resetCode/:code/:id')
  resetCode(
    @Param('code') code: string,
    @Param('id') id: string,
  ) {
    return this.authService.resetCode(id, code);
  }

  @Post('verifyCode/:code/:id')
  verifyCode(
    @Param('code') code: string,
    @Param('id') id: string,
  ) {
    return this.authService.verifyCode(id, code);
  }

  @Post('setPassword/:id')
  setPassword(@Param('id') id: string, @Body() createPasswordDto: CreatePasswordDto) {
    return this.authService.setPassword(id, createPasswordDto);
  }

  @Patch('resetPassword/:id')
  resetPassword(@Param('id') id: string, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(id, resetPasswordDto);
  }
  @Patch('changePassword/:id') 
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto ) {
    return this.authService.changePassword(id, changePasswordDto);
  }

}
