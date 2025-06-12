interface IResponse {
  code: number;
  message: string | null;
  content?: object;
}

export interface AuthResponse extends IResponse {
  content?: {
    refreshToken: string;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string | null;
  };
}

export interface UserInfoResponse extends IResponse {
  content?: {
    channelId: string;
    channelName: string;
  };
}

export interface ChannelInfoResponse extends IResponse {
  content?: {
    channelId: string;
    channelName: string;
    channelImageUrl: string;
    followerCount: number;
  };
}
