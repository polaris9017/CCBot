import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const response = await fetch(`${process.env.BACK_API_URL}/user/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `${request.headers.get('Authorization')}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete user' },
      { status: response.status }
    );
  }

  return NextResponse.json({ status: 'success', message: 'User deleted successfully' });
}
