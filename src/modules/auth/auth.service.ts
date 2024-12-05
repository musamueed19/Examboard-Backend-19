import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/db/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePasswordDto } from './dto/create-password.dto';
import { ChangePasswordDto } from '../settings/dto/change-password.dto';
// import * as bcrypt from 'bcrypt';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    // private mailService: MailService,
  ) {}
  // async verifyToken(token: string) {
  //   // Hash the token
  //   const hashedToken = createHash('sha256').update(token).digest('hex');
  //   // Find the hashed token in db
  //   const user = await this.userService.findOne({
  //     reset_token: hashedToken,
  //   });
  //   // Throw error if none found
  //   if (!user) {
  //     throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
  //   }
  //   // Return success response
  //   return { statusCode: HttpStatus.OK, token };
  // }
  // async verifyResetToken(token: string) {
  //   // Hash the token
  //   const hashedToken = createHash('sha256').update(token).digest('hex');
  //   // Find the hashed token in db
  //   const user = await this.userService.findOne({
  //     reset_token: hashedToken,
  //   });
  //   // Throw error if none found
  //   if (!user) {
  //     throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
  //   }
  //   // Return success response
  //   return { statusCode: HttpStatus.OK, token };
  // }
  // async verifyEmail(token: string, password: string) {
  //   // Find the user in db
  //   const hashedToken = createHash('sha256').update(token).digest('hex');
  //   console.log(hashedToken, token);
  //   const user = await this.userService.findOne({
  //     reset_token: hashedToken,
  //   });
  //   // If not found throw error
  //   if (!user) {
  //     throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
  //   }
  //   // Other error handling
  //   if (user.is_validate) {
  //     throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
  //   }
  //   if (user.is_active) {
  //     throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 12);
  //   user.password = hashedPassword;
  //   user.is_validate = true;
  //   user.reset_code_upto = null;
  //   user.is_active = true;
  //   // Save changes
  //   await this.userService.save(user);
  //   return { message: 'Email Verification Successul. Password set.' };
  // }
  async login(loginAuthDto: LoginAuthDto): Promise<any> {
    const { email, password } = loginAuthDto;

    // Fetch user and faculty
    const userAndFaculty = await this.userService.authOne(email);
    console.log('userAndFaculty:', userAndFaculty);

    const user = userAndFaculty.user;
    const faculty = userAndFaculty.faculty || {}; // Default to empty object if undefined
    console.log('faculty:', faculty);

    if (!user.is_validate) {
      throw new HttpException(
        'Access denied. Please verify your email.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!user.is_active) {
      throw new HttpException(
        'Access denied. Please contact admin',
        HttpStatus.FORBIDDEN,
      );
    }

    // Check if password is correct
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      console.log('Password mismatch');
      throw new UnauthorizedException('Invalid Password');
    }

    // Sign the token
    const payload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.jwtSecretKey,
    });

    console.log('working');
    const roles = user.userRole.map((userRole) => userRole.role.name);

    // Send the token
    return {
      user: {
        id: user.id,
        name: faculty?.name ?? 'Unknown',
        email: user.email,
        phone: faculty?.contact_number ?? 'N/A',
        roles, // Include role names
      },
      access_token: accessToken,
    };
  }

  // async forgotPassword(email: string): Promise<any> {
  //   const user = await this.userRepository.findOne({
  //     where: { email: email },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User does not exist.');
  //   }

  //   const resetCode = Math.floor(1000 + Math.random() * 9000);
  //   user.reset_password_code = resetCode.toString();

  //   const resetCodeExpiration = new Date();
  //   resetCodeExpiration.setHours(resetCodeExpiration.getHours() + 1);
  //   user.reset_code_upto = resetCodeExpiration;

  //   await this.userRepository.save(user);

  //   const url = `http://localhost:3000/auth/resetCode/${resetCode}:id`;

  //   const transporter = nodemailer.createTransport({
  //     host: 'localhost',
  //     port: 1025,
  //     secure: false,
  //   });

  //   const mailOptions = {
  //     from: '"YourApp" <no-reply@yourapp.com>',
  //     to: email,
  //     subject: 'Password Reset Request',
  //     text: `You requested a password reset. Use this code: ${resetCode}`,
  //     html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${url}">Reset Password</a>`,
  //   };

  //   await transporter.sendMail(mailOptions);

  //   return `Email sent to ${email}`;
  // }
  // import { createHash } from 'crypto';

  async resetCode(id: string, code: string): Promise<any> {
    const user = await this.userService.lookUp(id);
    console.log(user);
    console.log(user.reset_password_code);

    if (!user || !user.reset_password_code) {
      throw new BadRequestException('Invalid or expired token');
    }

    const currentTime = new Date();

    // Hash the provided code to compare with the stored hash
    const hashedCode = createHash('sha256').update(code).digest('hex');

    // Compare the provided code with the stored hash
    if (user.reset_password_code !== hashedCode) {
      throw new BadRequestException('Invalid token');
    }

    // Check if the reset token has expired
    if (user.reset_code_upto < currentTime) {
      throw new BadRequestException('Expired token');
    }

    return { message: 'Code matches successfully' };
  }

  async verifyCode(id: string, code: string): Promise<any> {
    console.log(id, code);

    const user = await this.userService.lookUp(id);
    if (!user || !user.reset_password_code) {
      throw new BadRequestException('Invalid or expired token');
    }

    const currentTime = new Date();
    const hashedCode = createHash('sha256').update(code).digest('hex');

    if (user.reset_password_code !== hashedCode) {
      throw new BadRequestException('Invalid token');
    }

    if (user.reset_code_upto < currentTime) {
      throw new BadRequestException('Expired token');
    }

    // Update only the 'is_validate' column
    const updateResult: UpdateResult = await this.userRepository.update(id, {
      is_validate: true,
    });

    if (updateResult.affected === 0) {
      throw new BadRequestException('Failed to update the user');
    }

    return { message: 'Code matches successfully' };
  }

  // async resetPassword(
  //   id: string,
  //   resetPasswordDto: ResetPasswordDto,
  // ): Promise<any> {
  //   const user = await this.userService.lookUp(id);
  
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  
  //   console.log(user);
  //   console.log(resetPasswordDto, user.password);
  
  //   const isSamePassword = await bcrypt.compare(
  //     resetPasswordDto.newPassword,
  //     user.password,
  //   );
  
  //   if (isSamePassword) {
  //     throw new BadRequestException(`Your new password can't be the same as the current password`);
  //   }
  
  //   // Hash the new password
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, salt);
    

  //   const inUsePassword = await this.userRepository.findOne({
  //     where: {
  //       password: hashedPassword,
  //     }
  //   });
  //   if(inUsePassword) {
  //     throw new BadRequestException(`Please choose a Unique Password`)
  //   }
  //   // Update only the required fields
  //   await this.userRepository.update(id, {
  //     password: hashedPassword,
  //     reset_password_code: null,
  //     reset_code_upto: null,
  //   });
  
  //   return { message: 'Password reset successfully' };
  // }
  

  // async setPassword(
  //   id: string,
  //   createPasswordDto: CreatePasswordDto,
  // ): Promise<any> {
  //   const user = await this.userService.lookUp(id);

  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }

  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(createPasswordDto.password, salt);

  //   const inUsePassword = await this.userRepository.findOne({
  //     where: {
  //       password: hashedPassword,
  //     }
  //   });
  //   if(inUsePassword) {
  //     throw new BadRequestException(`Please choose a Unique Password`)
  //   }

  //   try {
  //     await this.userRepository.save({
  //       id: user.id,
  //       password: hashedPassword,
  //     });

  //     return { message: `Password created successfully` };
  //   } catch (error) {
  //     console.error('Error while saving user:', error);
  //     throw new InternalServerErrorException('Failed to set password');
  //   }
  // }

  // async changePassword(
  //   id: string,
  //   changePasswordDto: ChangePasswordDto,
  // ): Promise<any> {
    
  //   const user = await this.userService.lookUp(id);

  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }
  //   const correctPassword = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
  //   if(!correctPassword) {
  //     throw new BadRequestException(`InValid current password`)
  //   }
  //   else if(changePasswordDto.currentPassword === changePasswordDto.newPassword) {
  //     throw new BadRequestException(`Your new password won't be the current password`)
  //   }
  //     const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, salt);

  //   const inUsePassword = await this.userRepository.findOne({
  //     where: {
  //       password: hashedPassword,
  //     }
  //   });
  //   if(inUsePassword) {
  //     throw new BadRequestException(`Please choose a Unique Password`)
  //   }

  //   try {
  //     await this.userRepository.save({
  //       id: user.id,
  //       password: hashedPassword,
  //     });

  //     return { message: `Password changed successfully` };
  //   } catch (error) {
  //     console.error('Error while saving user:', error);
  //     throw new InternalServerErrorException('Failed to set password');
  //   }
    
    
  // }
  private async isPasswordUnique(newPassword: string): Promise<boolean> {
    const allUsers = await this.userRepository.find({ select: ['password'] });
  
    for (const user of allUsers) {
      const isMatch = await bcrypt.compare(newPassword, user.password);
      if (isMatch) {
        return false; // Password exists in the database
      }
    }
  
    return true; // Password is unique
  }

  async resetPassword(
    id: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    const user = await this.userService.lookUpAll(id);
  
  
    const isSamePassword = await bcrypt.compare(
      resetPasswordDto.newPassword,
      user.password,
    );
  
    if (isSamePassword) {
      throw new BadRequestException(`Your new password can't be the same as the current password`);
    }
  
    const isUnique = await this.isPasswordUnique(resetPasswordDto.newPassword);
    if (!isUnique) {
      throw new BadRequestException(`Please choose a unique password`);
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, salt);
  
    await this.userRepository.update(id, {
      password: hashedPassword,
      reset_password_code: null,
      reset_code_upto: null,
    });
  
    return { message: 'Password reset successfully' };
  }

  async setPassword(
    id: string,
    createPasswordDto: CreatePasswordDto,
  ): Promise<any> {
    const user = await this.userService.lookUpAll(id);
  
  
    const isUnique = await this.isPasswordUnique(createPasswordDto.password);
    if (!isUnique) {
      throw new BadRequestException(`Please choose a unique password`);
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createPasswordDto.password, salt);
  
    try {
      await this.userRepository.save({
        id: user.id,
        password: hashedPassword,
      });
  
      return { message: `Password created successfully` };
    } catch (error) {
      console.error('Error while saving user:', error);
      throw new InternalServerErrorException('Failed to set password');
    }
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const user = await this.userService.lookUpAll(id);
  
  
    const correctPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!correctPassword) {
      throw new BadRequestException(`Invalid current password`);
    } else if(changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException(`Your new password won't be the current password`)
    }

  
    const isUnique = await this.isPasswordUnique(changePasswordDto.newPassword);
    if (!isUnique) {
      throw new BadRequestException(`Please choose a unique password`);
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, salt);
  
    try {
      await this.userRepository.save({
        id: user.id,
        password: hashedPassword,
      });
  
      return { message: `Password changed successfully` };
    } catch (error) {
      console.error('Error while saving user:', error);
      throw new InternalServerErrorException('Failed to change password');
    }
  }
  
  async forgotPassword(email: string) {
    const user = await this.userService.authOneUser(email);

    if (!user) {
      throw new HttpException('Email does not exist', HttpStatus.NOT_FOUND);
    }
  
    console.log("User ID:", user.id); // Debugging
  
    if (user.is_validate === false) {
      throw new HttpException('User is not verified', HttpStatus.BAD_REQUEST);
    }
  
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedResetCode = createHash('sha256')
      .update(resetCode)
      .digest('hex');
  
    const resetCodeExpiration = new Date();
    resetCodeExpiration.setHours(resetCodeExpiration.getHours() + 1);
  
    // Update only the reset_password_code and reset_code_upto fields
    await this.userRepository.update(user.id, {
      reset_password_code: hashedResetCode,
      reset_code_upto: resetCodeExpiration,
    });
  
    const url = `http://localhost:3000/auth/${user.id}/resetverification`;
  
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
    });
  
    try {
      const mailOptions = {
        from: '"YourApp" <no-reply@yourapp.com>',
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Use this code: ${resetCode}`,
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${url}">Reset Password</a>`,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Error sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  
    return { message: 'Password reset link sent to your email' };
  }
  
  // async resetPassword(token: string, password: string) {
  //   const hashedResetToken = createHash('sha256').update(token).digest('hex');
  //   const user = await this.userRepository.findOneBy({
  //     reset_password_code: hashedResetToken,
  //   });
  //   console.log(token, hashedResetToken);
  //   if (!user) {
  //     throw new HttpException('Invalid reset token', HttpStatus.NOT_FOUND);
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 12);
  //   user.password = hashedPassword;
  //   user.reset_toke = null;
  //   user.passwordChangedAt = new Date();
  //   // Save changes]
  //   await this.userService.save(user);
  //   return { message: 'Password has been reset successfully' };
  // }
}
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { LoginAuthDto } from './dto/login-auth.dto';
// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';
// import { RolesService } from '../roles/roles.service';

// @Injectable()
// export class AuthService {

//   constructor(
//     private userService: UsersService,
//     private jwtService: JwtService,
//     private roleService: RolesService,
//   ){};

//   async login(loginAuthDto: LoginAuthDto): Promise<any> {
//     const {email, password} = loginAuthDto;
//     const user = await this.userService.findOne(email);
//     const roles = this.roleService.findOne(user.id)
//   console.log(roles);

//   if (!user || user.password != password) {
//     console.log('Password mismatch or user not found');
//     throw new UnauthorizedException('Invalid credentials');
//   }

//   const payload = { id: user.id, email: user.email, role: (await roles).password };
//   return {
//     access_token: await this.jwtService.signAsync(payload),
//     user: payload,
//   };

//   }

// }
