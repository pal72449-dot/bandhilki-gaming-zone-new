// @ts-nocheck
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token) redirect('/admin/login');

  let bookings = [];
  let contacts = [];
  let expenses = [];
  
  try {
    const bookingsRes = await db.execute('SELECT * FROM bookings ORDER BY booking_date DESC, time_slot DESC');
    const contactsRes = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC');
    const expensesRes = await db.execute('SELECT * FROM expenses ORDER BY created_at DESC');
    bookings = bookingsRes.rows;
    contacts = contactsRes.rows;
    expenses = expensesRes.rows;
  } catch (err) {
    console.error("Dashboard DB Query failed:", err);
  }

  return (
    <DashboardClient 
      initialBookings={bookings} 
      initialContacts={contacts} 
      initialExpenses={expenses} 
    />
  );
}
