"use client";

import { useState } from 'react';
import styles from './UserAuthModal.module.css';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function UserAuthModal({ isOpen, onClose, onSuccess }: UserAuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/user/login' : '/api/user/signup';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // If login, it returns the user directly. If signup, we fetch /me down the line or just pass what we can
        // To be safe we can just tell success and let parent component fetch /me
        onSuccess(data.user || { id: data.userId, name: formData.name, email: formData.email, phone: formData.phone });
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <h2 className={`glow-cyan ${styles.title}`}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input 
                required 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className={styles.input} 
              />
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              required 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className={styles.input} 
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Phone Number (Optional)</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                className={styles.input} 
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              required 
              type="password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className={styles.input} 
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button"
            className={styles.toggleLink}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
