import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const GET = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET as string });
  const response = await fetch(`${process.env.BACK_API_URL}/setting`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token?.user.accessToken}`,
    },
  });

  return NextResponse.json(await response.json());
};

export const PATCH = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET as string });
  const body = await request.json();

  const response = await fetch(`${process.env.BACK_API_URL}/setting`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.user.accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: response.status });
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });
};
