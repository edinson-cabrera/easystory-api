import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInEmailDto } from './dto/sign-in.dto';

@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() signInEmailDto: SignInEmailDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = signInEmailDto;
    const valid = await this.authService.validateUser(signInEmailDto, response);
    if (!valid) {
      throw new UnauthorizedException();
    }
    return valid;
  }
}
