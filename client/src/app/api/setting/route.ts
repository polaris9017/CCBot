import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import * as jwt from 'jsonwebtoken';

export const GET = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET as string });
  const response = await fetch(`${process.env.BACK_API_URL}/setting`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwt.sign(
        JSON.stringify({
          user: {
            id: token?.id,
          },
        }),
        process.env.AUTH_SECRET as string
      )}`,
    },
  });

  return NextResponse.json(await response.json());
};
