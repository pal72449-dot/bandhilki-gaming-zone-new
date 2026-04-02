"use client";
// @ts-nocheck
import { useState } from 'react';
import styles from './Dashboard.module.css';

export default function BookingsManager({ initialBookings }: any) {
  const [bookings, setBookings] = useState(initialBookings);

  const handleStatusChange = async (id: number, newStatus: string) => {
    // Optimistic UI update for snappy feedback
    setBookings(bookings.map((b: any) => b.id === id ? { ...b, status: newStatus } : b));
    
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const handlePrint = (booking: any) => {
    const invoiceWindow = window.open('', '_blank');
    if (invoiceWindow) {
      invoiceWindow.document.write(`
        <html><head><title>Invoice #${booking.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 30px; padding-bottom: 10px; }
          .title { font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          .table th, .table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
          .table th { background-color: #f8f8f8; color: #000; }
          .total-row { font-weight: bold; font-size: 18px; }
          .footer { margin-top: 50px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #ddd; padding-top: 20px;}
          .meta-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        </style>
        </head><body>
          <div class="header">
            <h1 class="title">BANDHILKI GAMING ZONE</h1>
            <p class="subtitle">Shop No 1A, Samar Set Building, Vasai West - 401202<br>Tel: +91 8180807208 / 7507368624</p>
          </div>
          
          <div class="meta-info">
            <div>
              <p><strong>Billed To:</strong><br>${booking.customer_name}<br>${booking.customer_phone}</p>
            </div>
            <div style="text-align: right;">
              <h2>INVOICE</h2>
              <p><strong>Invoice No:</strong> #INV-${booking.id}<br><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <table class="table">
            <tr><th>Description</th><th>Schedule</th><th>Amount</th></tr>
            <tr>
              <td>${booking.console_type} (${booking.game_mode})</td>
              <td>${booking.booking_date} @ ${booking.time_slot}</td>
              <td>Rs. ${booking.price_calculated !== undefined ? booking.price_calculated : 150}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2" style="text-align: right;">Total Amount:</td>
              <td>Rs. ${booking.price_calculated !== undefined ? booking.price_calculated : 150}</td>
            </tr>
          </table>
          <div class="footer">
            Thank you for choosing the ultimate gaming experience!<br>Follow us on Instagram <strong>@bandhilki_gaming_zone</strong>
          </div>
          <script>window.print();</script>
        </body></html>
      `);
      invoiceWindow.document.close();
    }
  };

  return (
    <div className={styles.tabPanel}>
      <h2 className={styles.sectionTitle}>Manage Bookings</h2>
      <div className={styles.tableContainer}>
        {bookings.length === 0 ? (
          <div className={styles.emptyState}>No bookings found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Experience</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <div><strong>{b.customer_name}</strong></div>
                    <div style={{fontSize: '0.8rem', color: '#888'}}>{b.customer_phone}</div>
                  </td>
                  <td>{b.console_type}<br/><small>{b.game_mode}</small></td>
                  <td>{b.booking_date}<br/><small>{b.time_slot}</small></td>
                  <td>
                    <select 
                      value={b.status} 
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      style={{
                        padding: '0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', 
                        color: b.status === 'Completed' ? '#00e5ff' : b.status === 'Cancelled' ? '#ff3333' : '#fff', 
                        border: '1px solid #444', outline: 'none', cursor: 'pointer', fontWeight: 'bold'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="No-Show">No-Show</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      onClick={() => handlePrint(b)}
                      style={{
                        background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)',
                        padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      Print Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
