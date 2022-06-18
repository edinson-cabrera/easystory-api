import { IsEmail, IsString } from 'class-validator';

export class SignInEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
