import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');
    
    const adminRes = await db.execute({
      sql: 'SELECT id FROM admins WHERE username = ? AND password_hash = ?',
      args: [username, hash]
    });

    if (adminRes.rows && adminRes.rows.length > 0) {
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'authenticated_session_key_example', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day session
      });
      
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid credentials. Please try again.' }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.json({ success: true });
}
