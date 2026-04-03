import Image from 'next/image';
import styles from './GamesLibrary.module.css';

export default function GamesLibrary() {
  const games = [
    { name: "FIFA 24", image: "/images/games/fifa24.png" },
    { name: "GTA V", image: "/images/games/gtav.png" },
    { name: "WWE 2K24", image: "/images/games/wwe2k24.png" },
    { name: "Cricket 24", image: "/images/games/cricket24.png" },
    { name: "Call of Duty", image: "/images/games/cod.png" },
    { name: "God of War", image: "/images/games/gow.png" },
    { name: "Spider-Man", image: "/images/games/spiderman.png" },
    { name: "Asphalt", image: "/images/games/asphalt.png" },
    { name: "EA FC 25", image: "/images/games/eafc25.png" },
    { name: "Mortal Kombat", image: "/images/games/mk.png" },
    { name: "Dragon Ball", image: "/images/games/dbz.png" },
    { name: "Uncharted", image: "/images/games/uncharted.png" }
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
                <Image src={game.image} alt={game.name} fill className={styles.gameImage} />
                <div className={styles.gameOverlay}></div>
                <span className={styles.gameName}>{game.name}</span>
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
