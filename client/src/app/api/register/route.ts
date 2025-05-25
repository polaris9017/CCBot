import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/serverActions/auth';
import { AuthResponse, ChannelInfoResponse, UserInfoResponse } from '@/types/response';
import { RegisterResponse } from '@/types/register';

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get('code');
  const session = await getSession();

  try {
    const user = session!.user!;

    const tokenResponse = await axios.post(`${process.env.CHZZK_API_URL}/auth/v1/token`, {
      grantType: 'authorization_code',
      clientId: process.env.NEXT_PUBLIC_CHZZK_CLIENT_ID,
      clientSecret: process.env.CHZZK_CLIENT_SECRET,
      code,
      state: user.uid!,
    });

    const { accessToken, tokenType } = (tokenResponse.data as AuthResponse).content!;

    const userInfoResponse = await axios.get(`${process.env.CHZZK_API_URL}/open/v1/users/me`, {
      headers: { Authorization: `${tokenType} ${accessToken}`, 'Content-Type': 'application/json' },
    });

    const { channelId, channelName } = (userInfoResponse.data as UserInfoResponse).content!;

    const channelInfoResponse = await axios.get(`${process.env.CHZZK_API_URL}/open/v1/channels`, {
      params: { channelIds: channelId },
      headers: {
        'Client-Id': process.env.NEXT_PUBLIC_CHZZK_CLIENT_ID,
        'Client-Secret': process.env.CHZZK_CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
    });

    const { channelImageUrl } = (channelInfoResponse.data as ChannelInfoResponse).content!;

    const updatedUserResponse = await axios.patch(
      `${process.env.BACK_API_URL}/user/me`,
      {
        channelId,
        channelName,
        channelImageUrl: channelImageUrl ?? '',
      },
      {
        headers: { Authorization: `Bearer ${user.accessToken!}` },
      }
    );

    return NextResponse.json({
      updated: updatedUserResponse.status === 204,
      channelId,
      channelName,
      channelImageUrl: channelImageUrl ?? '',
    } as RegisterResponse);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    } else {
      console.error(error);
      return NextResponse.json('An unexpected error occurred', {
        status: 500,
      });
    }
  }
};
