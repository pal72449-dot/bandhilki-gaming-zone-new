import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const info = await db.execute({
      sql: 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      args: [name, email, message]
    });

    console.log(`Saved new contact form submission to DB (ID: ${info.lastInsertRowid})`);

    return NextResponse.json(
      { message: 'Message sent successfully and saved to Database.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving contact form to database:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
