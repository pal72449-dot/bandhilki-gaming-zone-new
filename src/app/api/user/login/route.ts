import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');
    
    const userRes = await db.execute({
      sql: 'SELECT id, name, email, phone FROM users WHERE email = ? AND password_hash = ?',
      args: [email, hash]
    });
    const user: any = userRes.rows[0];

    if (user) {
      const cookieStore = await cookies();
      cookieStore.set('auth_token', String(user.id), { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days session
      });
      
      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid credentials. Please try again.' }, { status: 401 });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 });
  }
}
