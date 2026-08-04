import {
  Body,
  Controller,
  Ip,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@ApiTags('Authentication')
@Controller('/api/v1/admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('setup-admin')
  @ApiOperation({
    summary: 'Create an admin account using a one-time setup token',
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Secret admin setup token from the backend environment.',
  })
  async setupAdmin(
    @Body() setupAdminDto: SetupAdminDto,
    @Query('token') token?: string,
  ) {
    console.log(token, setupAdminDto.token,"❤️");
    return this.authService.setupAdmin(setupAdminDto, token);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Admin Login',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset OTP',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Ip() ipAddress: string,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto, ipAddress);
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify password reset OTP',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Ip() ipAddress: string) {
    return this.authService.verifyOtp(verifyOtpDto, ipAddress);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password with verified reset token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Change authenticated admin password',
  })
  async changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(request.user.id, changePasswordDto);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Rotate refresh token and issue a new access token',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Logout and revoke refresh token',
  })
  async logout(
    @Req() request: AuthenticatedRequest,
    @Body() _logoutDto: LogoutDto,
  ) {
    return this.authService.logout(request.user.id);
  }
}
