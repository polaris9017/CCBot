import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  naverUid: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
