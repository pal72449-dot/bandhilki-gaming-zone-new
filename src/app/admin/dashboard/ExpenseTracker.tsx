"use client";
// @ts-nocheck
import { useState } from 'react';
import styles from './Dashboard.module.css';

export default function ExpenseTracker({ initialExpenses }: any) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Electricity' });
  const [status, setStatus] = useState('');

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        const newExpense = { 
          id: data.id, 
          ...form, 
          amount: Number(form.amount), 
          created_at: new Date().toISOString() 
        };
        setExpenses([newExpense, ...expenses]);
        setForm({ description: '', amount: '', category: 'Electricity' });
        setStatus('Expense added successfully!');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch {
      setStatus('Network error');
    }
  };

  return (
    <div className={styles.tabPanel}>
      <h2 className={styles.sectionTitle}>Daily Expense Tracker</h2>

      <div style={{ background: 'rgba(10,10,15,0.6)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '3rem' }}>
        <h3 style={{ color: 'var(--neon-pink)', margin: '0 0 1.5rem 0' }}>Add New Expense</h3>
        <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
             <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
             <input required type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} placeholder="e.g., PS5 Game CD" />
          </div>
          <div style={{ width: '150px' }}>
             <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Amount (₹)</label>
             <input required type="number" min="1" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} placeholder="500" />
          </div>
          <div style={{ width: '200px' }}>
             <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
             <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}>
                <option value="Electricity">Electricity</option>
                <option value="Equipment">Equipment (Controllers/CDs)</option>
                <option value="Snacks">Snacks Inventory</option>
                <option value="Maintenance">Maintenance & Repair</option>
                <option value="Marketing">Marketing (Instagram/Ads)</option>
                <option value="Other">Other</option>
             </select>
          </div>
          <button type="submit" style={{ padding: '0.9rem 2rem', background: 'var(--neon-pink)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Log</button>
        </form>
        {status && <div style={{ marginTop: '1rem', color: '#00e5ff' }}>{status}</div>}
      </div>

      <div className={styles.tableContainer}>
        {expenses.length === 0 ? (
          <div className={styles.emptyState}>No expenses logged yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e: any) => (
                <tr key={e.id}>
                  <td>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td>{e.description}</td>
                  <td><span style={{ border: '1px solid #888', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{e.category}</span></td>
                  <td style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>- ₹{e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
