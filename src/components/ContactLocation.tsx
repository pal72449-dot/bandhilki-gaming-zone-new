"use client";

import { useState } from 'react';
import styles from './ContactLocation.module.css';

export default function ContactLocation() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setStatus('Message Sent Successfully!');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className="container">
        <h2 className={`text-gradient-pink ${styles.sectionTitle}`}>Contact & Location</h2>
        
        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.infoCard}`}>
            <h3 className="glow-cyan">Visit Us</h3>
            <p className={styles.address}>
              <strong>Bandhilki Gaming Zone</strong><br/>
              Shop No 1A, Samar Set Building,<br/>
              Near Vartak College, Opposite Union Bank,<br/>
              Vasai West – 401202, Maharashtra, India
            </p>
            
            <div className={styles.contactDetails}>
              <p>📞 8180807208 / 7507368624</p>
              <p>📸 Instagram: <a href="https://instagram.com/bandhilki_gaming_zone" target="_blank" rel="noreferrer" className="text-gradient-cyan">@bandhilki_gaming_zone</a></p>
            </div>
            
            <div className={styles.mapContainer}>
              <div className={styles.mapOverlay}>
                <span>Map View</span>
              </div>
            </div>
          </div>
          
          <div className={`${styles.card} ${styles.formCard}`}>
            <h3 className="glow-purple">Send a Message</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} required className={styles.input}></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>Send</button>
              {status && <p className={styles.statusMessage}>{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
