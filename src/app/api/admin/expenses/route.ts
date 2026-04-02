import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has('admin_token');
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { description, amount, category } = await request.json();

    if (!description || !amount || !category) {
      return NextResponse.json({ error: 'Missing expense fields' }, { status: 400 });
    }

    const info = await db.execute({
      sql: 'INSERT INTO expenses (description, amount, category) VALUES (?, ?, ?)',
      args: [description, Number(amount), category]
    });

    return NextResponse.json({ success: true, id: Number(info.lastInsertRowid) }, { status: 200 });
  } catch (error) {
    console.error('Expense Error:', error);
    return NextResponse.json({ error: 'Failed to record expense' }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const expenseRes = await db.execute('SELECT * FROM expenses ORDER BY created_at DESC');
    return NextResponse.json({ expenses: expenseRes.rows }, { status: 200 });
  } catch (error) {
    console.error('Fetch Expenses Error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}
