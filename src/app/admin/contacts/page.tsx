import db from '@/lib/db';
import styles from './Admin.module.css';

export const dynamic = 'force-dynamic'; // Prevent static caching

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminContacts() {
  // Fetch data directly from SQLite DB using Next.js Server Components
  let contacts: Contact[] = [];
  
  try {
    contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all() as Contact[];
  } catch (err) {
    console.error("DB Query failed:", err);
  }

  return (
    <section className={styles.adminSection}>
      <div className="container">
        <h1 className={`glow-cyan ${styles.title}`}>Admin Dashboard: Inquiries</h1>
        
        <div className={styles.tableContainer}>
          {contacts.length === 0 ? (
            <div className={styles.emptyState}>No messages yet. Head over to the home page and submit a form!</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{new Date(c.created_at).toLocaleString()}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
