import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  naverUid: string;

  @IsString()
  @IsNotEmpty()
  uid: string;
}
