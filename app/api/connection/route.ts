import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const res = NextResponse.json({});
  res.cookies.set('connectionString', uuidv4(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return res;
}
