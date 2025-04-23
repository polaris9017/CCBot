import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  naverUid: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
