import styles from './Hero.module.css';

interface HeroProps {
  onBookNow: () => void;
}

export default function Hero({ onBookNow }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>
          <span className={styles.badgePulse}></span>
          Now Open in Vasai West
        </div>
        
        <h1 className={styles.title}>
          <span className="text-gradient-cyan">Bandhilki</span><br />
          <span className="text-gradient-pink">Gaming Zone</span>
        </h1>
        
        <p className={styles.tagline}>
          Start the New Year with the Ultimate PS5 Gaming Experience! High-fidelity graphics, premium RGB ambience, and lag-free gameplay. <strong>Now offering PS5 Home Rentals!</strong>
        </p>
        
        <div className={styles.ctaGroup}>
          <button onClick={onBookNow} className={styles.primaryBtn}>
            <span>Book Now</span>
            <div className={styles.btnGlow}></div>
          </button>
          <a href="#pricing" className={styles.secondaryBtn}>
            View Pricing
          </a>
        </div>
      </div>
      
      {/* Decorative Cyber lines */}
      <div className={styles.cyberLineLeft}></div>
      <div className={styles.cyberLineRight}></div>
    </section>
  );
}
