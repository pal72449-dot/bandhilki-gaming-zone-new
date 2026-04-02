import styles from './Pricing.module.css';

interface PricingProps {
  onBookNow: (consoleType: string) => void;
}

export default function Pricing({ onBookNow }: PricingProps) {
  const plans = [
    {
      title: "Multiplayer (PS5)",
      price1: "₹50 / Hour",
      price2: "₹30 / 30 Min",
      desc: "Per person. Challenge your friends!",
      glow: "cyan"
    },
    {
      title: "Solo Player (PS5)",
      price1: "₹80 / Hour",
      price2: "₹50 / 30 Min",
      desc: "Immerse yourself completely.",
      glow: "pink"
    },
    {
      title: "Happy Hours",
      price1: "₹30 / Hour (Multi)",
      price2: "₹50 / 30 Min (Solo)",
      desc: "Daily 6 PM - 9 PM. Don't miss out!",
      glow: "purple"
    }
  ];

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className="container">
        <h2 className={`glow-cyan ${styles.sectionTitle}`}>Pricing Plans</h2>
        
        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div key={index} className={`${styles.card} ${styles['glow-' + plan.glow]}`}>
              <h3 className={styles.cardTitle}>{plan.title}</h3>
              <div className={styles.priceBox}>
                <div className={styles.price}>{plan.price1}</div>
                <div className={styles.price}>{plan.price2}</div>
              </div>
              <p className={styles.cardDesc}>{plan.desc}</p>
              <button 
                className={styles.bookBtn} 
                onClick={() => onBookNow('PS5')}
              >
                Book Slot
              </button>
            </div>
          ))}
        </div>
        
        <div className={styles.specialZones}>
          <div 
            className={`${styles.zoneCard} ${styles.theaterCard}`}
            onClick={() => onBookNow('Private Theater')}
          >
            <h3 className="text-gradient-pink">Private Movie Theatre</h3>
            <p className={styles.zonePrice}>₹100 / hour</p>
            <p className={styles.zoneDesc}>For any number of people. Watch in style!</p>
            <button className={`${styles.bookBtn} ${styles.zoneBtn}`}>Reserve Theater</button>
          </div>
          <div 
            className={`${styles.zoneCard} ${styles.partyCard}`}
            onClick={() => onBookNow('Birthday Party Zone')}
          >
            <h3 className="text-gradient-cyan">Birthday Party Zone</h3>
            <p className={styles.zonePrice}>₹400 / hour</p>
            <p className={styles.zoneDesc}>Full zone rental for the ultimate celebration.</p>
            <button className={`${styles.bookBtn} ${styles.zoneBtn}`}>Book Party</button>
          </div>
          <div 
            className={`${styles.zoneCard} ${styles.rentalCard}`}
            onClick={() => onBookNow('PS5 Home Rental')}
          >
            <h3 className="text-gradient-purple">PS5 Home Rental</h3>
            <p className={styles.zonePrice}>₹800 / Day</p>
            <p className={styles.zoneDesc}>Take the premium gaming experience home! Includes 2 controllers + Top Games.</p>
            <button className={`${styles.bookBtn} ${styles.zoneBtn}`}>Rent Console</button>
          </div>
        </div>
      </div>
    </section>
  );
}
