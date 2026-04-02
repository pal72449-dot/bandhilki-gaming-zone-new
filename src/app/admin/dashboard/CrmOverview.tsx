"use client";
// @ts-nocheck
import { useMemo } from 'react';
import styles from './Dashboard.module.css';

export default function CrmOverview({ bookings }: any) {
  // Aggregate individual bookings into distinct Lifetime Value customer instances
  const crmData = useMemo(() => {
    const map = new Map();
    bookings.forEach((b: any) => {
      // Use phone number as unique identifier primary key heuristic
      const id = b.customer_phone;
      if (!map.has(id)) {
        map.set(id, {
          name: b.customer_name,
          phone: b.customer_phone,
          totalBookings: 0,
          totalSpent: 0,
          lastVisit: b.booking_date
        });
      }
      
      const customer = map.get(id);
      customer.totalBookings += 1;
      
      if (b.status === 'Completed' || b.status === 'Confirmed') {
        customer.totalSpent += (b.price_calculated !== undefined ? b.price_calculated : 150);
      }
      
      // Update most recent visit
      if (b.booking_date > customer.lastVisit) {
        customer.lastVisit = b.booking_date;
      }
    });
    
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [bookings]);

  return (
    <div className={styles.tabPanel}>
      <h2 className={styles.sectionTitle}>Customer Relationship Management (CRM)</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Total Bookings</th>
              <th>Total Lifetime Value (LTV)</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {crmData.map((c, i) => (
              <tr key={i}>
                <td>
                  <strong>{c.name}</strong>
                  {i < 3 && c.totalSpent > 0 && (
                    <span style={{marginLeft: '10px', fontSize: '0.8rem', color: '#00e5ff', border: '1px solid #00e5ff', padding: '2px 6px', borderRadius: '10px'}}>VIP</span>
                  )}
                </td>
                <td>{c.phone}</td>
                <td>{c.totalBookings} times</td>
                <td style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>₹{c.totalSpent}</td>
                <td>{c.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
