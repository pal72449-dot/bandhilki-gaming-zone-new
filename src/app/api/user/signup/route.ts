import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');

    const existingRes = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    });
    
    if (existingRes.rows && existingRes.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const info = await db.execute({
      sql: 'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
      args: [name, email, phone || null, hash]
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', String(info.lastInsertRowid), { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({ success: true, userId: Number(info.lastInsertRowid) }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: 'Server error during signup' }, { status: 500 });
  }
}
