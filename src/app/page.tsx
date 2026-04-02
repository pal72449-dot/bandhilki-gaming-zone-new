"use client";

import { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import GamesLibrary from "@/components/GamesLibrary";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactLocation from "@/components/ContactLocation";
import BookingModal from "@/components/BookingModal";
import UserAuthModal from "@/components/UserAuthModal";

export default function Home() {
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [preselectedConsole, setPreselectedConsole] = useState('PS5');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(console.error);
  }, []);

  const openBooking = (consoleType: string = 'PS5') => {
    setPreselectedConsole(consoleType);
    if (!user) {
      setAuthOpen(true);
    } else {
      setBookingOpen(true);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setAuthOpen(false);
    setBookingOpen(true); // resume booking open!
  };

  const handleLogout = () => {
    fetch('/api/user/logout', { method: 'POST' }).then(() => setUser(null));
  };

  return (
    <main>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#00f2fe' }}>
            <span>Welcome, {user.name}</span>
            <button 
              onClick={handleLogout}
              style={{ background: 'transparent', border: '1px solid #00f2fe', color: '#00f2fe', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setAuthOpen(true)}
            style={{ background: 'linear-gradient(45deg, #00f2fe, #4facfe)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Login / Resister
          </button>
        )}
      </div>

      <Hero onBookNow={() => openBooking('PS5')} />
      <Pricing onBookNow={openBooking} />
      <GamesLibrary />
      <WhyChooseUs />
      <ContactLocation />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setBookingOpen(false)} 
        preselectedConsole={preselectedConsole} 
        user={user}
      />

      <UserAuthModal 
        isOpen={isAuthOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
}
