import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('all')
  getProfiles() {
    return this.authService.getUsers();
  }

  @Public()
  @Put('reset-password')
  setPassword(@Body() passwordDto: Record<string, any>) {
    return this.authService.setPassword(passwordDto.password, passwordDto.resetToken)
  }

  @Public()
  @Get('token/:token')
  GetToken(@Param() UserDto: Record<string, any>) {
    return this.authService.getResetToken(UserDto.token)
  }
}
