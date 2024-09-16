import { NextResponse } from 'next/server';
import { getAuth } from '../api/auth/authOptions';

export async function GET() {
  const session = await getAuth();
  return NextResponse.json({ session });
}
