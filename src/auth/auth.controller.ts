import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInEmailDto } from './dto/sign-in.dto';
import { Public } from 'src/decorators/auth.decorator';

@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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
    return await this.authService.generateAccessToken(email, response);
  }

  @Get('me')
  async profile(@Req() request: Request) {
    return await this.authService.profile(request);
  }
}
