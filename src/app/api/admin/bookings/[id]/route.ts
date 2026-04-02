import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has('admin_token');
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;
    const { status, price_calculated } = await request.json();

    if (!status && price_calculated === undefined) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    let query = 'UPDATE bookings SET ';
    const params: (string | number)[] = [];

    if (status) {
      query += 'status = ? ';
      params.push(status);
    }
    
    if (price_calculated !== undefined) {
      query += status ? ', price_calculated = ? ' : 'price_calculated = ? ';
      params.push(Number(price_calculated));
    }

    query += 'WHERE id = ?';
    params.push(id);

    await db.execute({ sql: query, args: params });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Toggle Error:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}
