"use client";
// @ts-nocheck

import { useState } from 'react';
import styles from './Dashboard.module.css';
import LogoutButton from '@/components/LogoutButton';
import ExpenseTracker from './ExpenseTracker';
import BookingsManager from './BookingsManager';
import CrmOverview from './CrmOverview';

export default function DashboardClient({ initialBookings, initialContacts, initialExpenses }: any) {
  const [activeTab, setActiveTab] = useState('Overview');

  // Compute Core ERP KPIs
  const totalRevenue = initialBookings
    .filter((b: any) => b.status !== 'Cancelled' && b.status !== 'No-Show' && b.status !== 'Rejected')
    .reduce((sum: number, b: any) => sum + (b.price_calculated !== undefined ? b.price_calculated : 150), 0);
    
  const totalExpenses = initialExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <main className={styles.dashboard}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>Bandhilki ERP</div>
        <nav className={styles.navMenu}>
          {['Overview', 'Bookings', 'CRM', 'Expenses', 'Messages'].map(tab => (
            <button 
              key={tab} 
              className={`${styles.navBtn} ${activeTab === tab ? styles.activeNav : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className={styles.bottomNav}>
           <LogoutButton className={styles.logoutBtn} />
        </div>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={`glow-cyan ${styles.title}`}>{activeTab}</h1>
        </header>

        {activeTab === 'Overview' && (
          <div className={styles.tabPanel}>
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiTitle}>Gross Revenue</div>
                <div className={`glow-cyan ${styles.kpiValue}`}>₹{totalRevenue}</div>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiTitle}>Total Expenses</div>
                <div className={`glow-pink ${styles.kpiValue}`}>₹{totalExpenses}</div>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiTitle}>Net Profit</div>
                <div className={`glow-purple ${styles.kpiValue}`}>₹{netProfit}</div>
              </div>
            </div>

            <h2 className={styles.sectionTitle}>Financial Analytics (Visual Spread)</h2>
            <div className={styles.chartContainer}>
               {/* Custom Dependency-Free CSS Bar Chart System for extreme performance */}
               <div className={styles.barWrapper}>
                 <div className={styles.barCyan} style={{ height: '100%' }}></div>
                 <span>Revenue</span>
               </div>
               <div className={styles.barWrapper}>
                 <div className={styles.barPink} style={{ height: `${totalRevenue === 0 ? 0 : Math.min((totalExpenses/totalRevenue)*100, 100)}%` }}></div>
                 <span>Expenses</span>
               </div>
               <div className={styles.barWrapper}>
                 <div className={styles.barPurple} style={{ height: `${totalRevenue === 0 ? 0 : Math.max(0, Math.min((netProfit/totalRevenue)*100, 100))}%` }}></div>
                 <span>Net Profit</span>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Bookings' && <BookingsManager initialBookings={initialBookings} />}
        {activeTab === 'CRM' && <CrmOverview bookings={initialBookings} />}
        {activeTab === 'Expenses' && <ExpenseTracker initialExpenses={initialExpenses} />}
        
        {activeTab === 'Messages' && (
           <div className={styles.tableContainer}>
             <table className={styles.table}>
               <thead>
                 <tr><th>Date</th><th>Name</th><th>Phone/Email</th><th>Message</th></tr>
               </thead>
               <tbody>
                 {initialContacts.map((c: any) => (
                   <tr key={c.id}>
                     <td>{new Date(c.created_at).toLocaleDateString()}</td>
                     <td>{c.name}</td>
                     <td>{c.email}</td>
                     <td>{c.message}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}
      </div>
    </main>
  );
}
