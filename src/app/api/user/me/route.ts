import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const userRes = await db.execute({
      sql: 'SELECT id, name, email, phone FROM users WHERE id = ?',
      args: [token]
    });
    const user: any = userRes.rows[0];

    if (user) {
      return NextResponse.json({ 
        authenticated: true, 
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone } 
      }, { status: 200 });
    } else {
      cookieStore.delete('auth_token');
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Auth Check Error:", error);
    return NextResponse.json({ error: 'Server error checking authentication' }, { status: 500 });
  }
}
