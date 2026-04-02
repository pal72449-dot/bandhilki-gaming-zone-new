"use client";

import { useState } from 'react';
import styles from './Login.module.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('Authenticating...');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        window.location.href = '/admin/dashboard';
      } else {
         setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h1 className={`glow-cyan ${styles.title}`}>Admin Portal</h1>
        <p className={styles.subtitle}>Authorized Personnel Only</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Access ID</label>
            <input 
              id="username"
              type="text" 
              required 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className={styles.input} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Passcode</label>
            <input 
              id="password"
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className={styles.input} 
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.loginBtn}>Initialize Link</button>
        </form>
      </div>
    </main>
  );
}
