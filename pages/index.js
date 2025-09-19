import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/TeamIntro.module.css';

// Team members and their roles
const teamMembers = [
  { name: 'Netransh Adhoj', role: 'Front-end Developer' },
  { name: 'Aditya Dahiya', role: 'Architect' },
  { name: 'Tisya Kaushik', role: 'Back-end Developer' },
  { name: 'Aditi Nagpal', role: 'Content Strategist + UI/UX' },
  { name: 'Subhashri Nath', role: 'UI/UX Designer' },
];

export default function TeamIntroPage() {
  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Team: Runtime Terrorsss - फंडा Finder</title>
      </Head>

      <main className={styles.mainLayout}>
        <section className={styles.problemStatement}>
          <h2>Problem Statement</h2>
          <p>
            Build an AI‑powered tool that detects potential misinformation and educates users on identifying credible, trustworthy content.
          </p>
        </section>

        <section className={styles.mainSection}>
          <header className={styles.header}>
            <p className={styles.teamName}>Team: Runtime Terrorsss</p>
            <p className={styles.presentsText}>presents</p>
            <div className={styles.appNameContainer}>
              <video 
                src="/logo.mp4" 
                className={styles.logoVideo} 
                autoPlay 
                loop 
                muted 
                playsInline 
              />
              <h1 className={styles.appName}>फंडा Finder</h1>
            </div>
          </header>

          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div key={member.name} className={styles.cardContainer}>
                <div className={styles.card}>
                  <div className={styles.cardFront}>
                    {member.name}
                  </div>
                  <div className={styles.cardBack}>
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/intro" className={styles.continueButton}>
            Continue to Website
          </Link>
        </section>
      </main>
    </div>
  );
}
