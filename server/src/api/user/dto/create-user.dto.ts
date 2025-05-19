import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  naverUid: string;

  @IsString()
  channelId: string;

  @IsString()
  channelName: string;

  @IsUrl()
  channelImageUrl: string;
}
