import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, game_mode, console_type, booking_date, time_slot, user_id } = body;

    if (!customer_name || !customer_phone || !booking_date || !time_slot) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const existingRes = await db.execute({
      sql: "SELECT id FROM bookings WHERE booking_date = ? AND time_slot = ? AND console_type = ? AND game_mode = ? AND status != 'Rejected'",
      args: [booking_date, time_slot, console_type, game_mode]
    });

    if (existingRes.rows && existingRes.rows.length > 0) {
      return NextResponse.json({ 
        error: 'This specific console mode is already booked for the selected time slot. Please try another slot.' 
      }, { status: 409 });
    }

    const info = await db.execute({
      sql: "INSERT INTO bookings (customer_name, customer_phone, game_mode, console_type, booking_date, time_slot, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [customer_name, customer_phone, game_mode, console_type, booking_date, time_slot, user_id || null]
    });

    return NextResponse.json(
      { message: 'Booking confirmed successfully!', booking_id: Number(info.lastInsertRowid) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (date) {
       const res = await db.execute({
         sql: 'SELECT time_slot, console_type, game_mode FROM bookings WHERE booking_date = ? AND status != "Rejected"',
         args: [date]
       });
       return NextResponse.json({ bookedSlots: res.rows }, { status: 200 });
    }
    
    return NextResponse.json({ error: 'Date query parameter is required for availability checks' }, { status: 400 });
  } catch (error) {
    console.error('GET Availability Error:', error);
    return NextResponse.json({ error: 'Failed to fetch slot availability' }, { status: 500 });
  }
}
