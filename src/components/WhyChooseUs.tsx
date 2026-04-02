import styles from './WhyChooseUs.module.css';

export default function WhyChooseUs() {
  const highlights = [
    { title: "Smooth Graphics", desc: "Experience lag-free, high-fidelity PS5 gameplay on premium displays.", color: "cyan" },
    { title: "RGB Ambience", desc: "Immersive seating with an energizing dark neon cyberpunk lighting aesthetic.", color: "pink" },
    { title: "Special Discounts", desc: "Enjoy 20% OFF for Girls (always!), lucky draws, and festive combos.", color: "purple" },
    { title: "Affordable Pricing", desc: "Top-tier gaming experience at rates that won't break the bank.", color: "cyan" }
  ];

  return (
    <section className={styles.whySection}>
      <div className="container">
        <h2 className={`glow-cyan ${styles.sectionTitle}`}>Why Choose Us</h2>
        
        <div className={styles.grid}>
          {highlights.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <div className={`${styles.iconGlow} ${styles['bg-' + item.color]}`}></div>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
