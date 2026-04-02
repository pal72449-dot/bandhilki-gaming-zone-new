"use client";

import { useState, useEffect } from 'react';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedConsole?: string;
  user?: any;
}

export default function BookingModal({ isOpen, onClose, preselectedConsole = 'PS5', user }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: '',
    consoleType: preselectedConsole,
    gameMode: 'Multiplayer'
  });
  
  // Pre-fill user data
  useEffect(() => {
    if (user && isOpen) {
       setFormData(f => ({ ...f, name: user.name || f.name, phone: user.phone || f.phone }));
    }
  }, [user, isOpen]);
  
  const [availableSlots] = useState<string[]>([
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', 
    '08:00 PM', '09:00 PM'
  ]);
  
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (formData.date && isOpen) {
      // Fetch availability dynamically
      fetch(`/api/bookings?date=${formData.date}`)
        .then(res => res.json())
        .then(data => {
          if (data.bookedSlots) {
             const taken = data.bookedSlots
              .filter((b: { console_type: string; time_slot: string }) => b.console_type === formData.consoleType)
              .map((b: { console_type: string; time_slot: string }) => b.time_slot);
             setBookedSlots(taken);
          }
        });
    }
  }, [formData.date, formData.consoleType, isOpen]);

  // Reset state intelligently decoupled from render cascades
  useEffect(() => {
    if (!isOpen) { 
       setTimeout(() => { setStep(1); setStatus(''); }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Processing booking...');
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          game_mode: formData.gameMode,
          console_type: formData.consoleType,
          booking_date: formData.date,
          time_slot: formData.timeSlot,
          user_id: user?.id || null
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('');
        setStep(4);
      } else {
        setStatus(data.error || 'Booking failed.');
      }
    } catch {
      setStatus('Network error. Please try again.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        {step === 1 && (
          <div className={styles.stepContainer}>
            <h2 className={`glow-cyan ${styles.title}`}>Select Experience</h2>
            <div className={styles.optionsGrid}>
              <button 
                className={`${styles.optionBtn} ${formData.consoleType === 'PS5' ? styles.selected : ''}`}
                onClick={() => setFormData({...formData, consoleType: 'PS5'})}
              >
                PlayStation 5
              </button>
              <button 
                className={`${styles.optionBtn} ${formData.consoleType === 'Private Theater' || formData.consoleType === 'Birthday Party Zone' ? styles.selected : ''}`}
                onClick={() => setFormData({...formData, consoleType: 'Private Theater'})}
              >
                Private Venue
              </button>
              <button 
                className={`${styles.optionBtn} ${formData.consoleType === 'PS5 Home Rental' ? styles.selected : ''}`}
                onClick={() => setFormData({...formData, consoleType: 'PS5 Home Rental', gameMode: 'Home Rental'})}
              >
                PS5 Home Rental
              </button>
            </div>
            {formData.consoleType === 'PS5' && (
              <div className={styles.optionsGrid}>
                 <button 
                  className={`${styles.optionBtn} ${formData.gameMode === 'Solo' ? styles.selected : ''}`}
                  onClick={() => setFormData({...formData, gameMode: 'Solo'})}
                >
                  Solo Player
                </button>
                <button 
                  className={`${styles.optionBtn} ${formData.gameMode === 'Multiplayer' ? styles.selected : ''}`}
                  onClick={() => setFormData({...formData, gameMode: 'Multiplayer'})}
                >
                  Multiplayer
                </button>
              </div>
            )}
            <button className={styles.nextBtn} onClick={handleNext}>Next Step</button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContainer}>
            <h2 className={`glow-pink ${styles.title}`}>Date & Time</h2>
            <div className={styles.formGroup}>
              <label>Select Date</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value, timeSlot: ''})}
                className={styles.input}
              />
            </div>
            
            {formData.date && (
              <div className={styles.slotsGrid}>
                {availableSlots.map(slot => {
                  const isBooked = bookedSlots.includes(slot);
                  return (
                    <button 
                      key={slot}
                      disabled={isBooked}
                      className={`${styles.slotBtn} ${formData.timeSlot === slot ? styles.selectedSlot : ''} ${isBooked ? styles.bookedSlot : ''}`}
                      onClick={() => setFormData({...formData, timeSlot: slot})}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
            
            <div className={styles.btnRow}>
              <button className={styles.prevBtn} onClick={handlePrev}>Back</button>
              <button 
                 className={styles.nextBtn} 
                 onClick={handleNext}
                 disabled={!formData.date || !formData.timeSlot}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContainer}>
            <h2 className={`glow-purple ${styles.title}`}>Confirm Details</h2>
            
            <div className={styles.summaryBox}>
              <p><strong>Experience:</strong> {formData.consoleType} {formData.consoleType === 'PS5' && `(${formData.gameMode})`}</p>
              <p><strong>When:</strong> {formData.date} at {formData.timeSlot}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={styles.input} />
              </div>
              
              {status && <p className={styles.error}>{status}</p>}

              <div className={styles.btnRow}>
                <button type="button" className={styles.prevBtn} onClick={handlePrev}>Back</button>
                <button type="submit" className={styles.confirmBtn}>Confirm Booking</button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className={styles.stepContainer}>
            <h2 className={`glow-cyan ${styles.title}`}>Booking Confirmed!</h2>
            <p className={styles.successText}>
              Your slot for {formData.date} at {formData.timeSlot} has been successfully reserved. 
              We&apos;ll see you at Bandhilki Gaming Zone!
            </p>
            <button className={styles.nextBtn} onClick={onClose}>Finish</button>
          </div>
        )}

      </div>
    </div>
  );
}
