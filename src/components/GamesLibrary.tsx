import styles from './GamesLibrary.module.css';

export default function GamesLibrary() {
  const games = [
    "FIFA 24", "GTA V", "WWE 2K24", "Cricket 24", 
    "Call of Duty", "God of War", "Spider-Man", 
    "Asphalt", "EA FC 25", "Mortal Kombat", 
    "Dragon Ball", "Uncharted"
  ];

  return (
    <section id="games" className={styles.gamesSection}>
      <div className="container">
        <h2 className={`glow-pink ${styles.sectionTitle}`}>Epic Games Library</h2>
        <p className={styles.subtitle}>Experience the latest blockbusters on PS5.</p>
        
        <div className={styles.grid}>
          {games.map((game, index) => (
            <div key={index} className={styles.gameCard}>
              <div className={styles.gameInner}>
                <span className={styles.gameName}>{game}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.moreInfo}>
          <p className="text-gradient-cyan">...and many more premium titles awaiting you!</p>
        </div>
      </div>
    </section>
  );
}
