import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInEmailDto } from './dto/sign-in.dto';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtService,
  ) {}

  async validateUser(signInEmailDto: SignInEmailDto, response: Response) {
    const user = await this.usersService.findByEmail(signInEmailDto.email);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    const isValidPassword = await bcrypt.compare(
      signInEmailDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password!');
    }
    const { password, ...result } = user;
    return result;
  }

  async generateAccessToken(email: string, response: Response) {
    const user = await this.usersService.findByEmail(email);
    const token = this.jwtTokenService.sign({
      email: user.email,
      id: user.id,
    });
    response.cookie('accesstoken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  async profile(request: Request) {
    try {
      const cookie = request.cookies['accesstoken'];

      const data = await this.jwtTokenService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findByEmail(data.email);

      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
