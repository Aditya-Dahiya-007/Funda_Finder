// pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Intro.module.css';

export default function IntroPage() {
  // The canvas background from the analyzer page is reused implicitly
  // because its styles are global now.
  
  return (
    <>
      <Head>
        <title>Welcome to Credibility Lens</title>
      </Head>

      <div className={styles.heroContainer}>
        <div className={styles.header}>
          <video 
            src="/logo.mp4" 
            className={styles.logoVideo} 
            autoPlay 
            loop 
            muted 
            playsInline 
          />
          <h1 className={styles.title}>फंडा Finder</h1>
        </div>
        <p className={styles.subtitle}>
          We roast misinformation — with receipts.
        </p>

        <div className={styles.factGrid}>
          <div className={styles.factCard}>
            <p className={styles.factStatistic} id={styles.factStatistic1}>Spot the Truth in Seconds</p>
            <p className={styles.factDescription}>
              No waiting, no guesswork—each post, article, or meme is checked and scored immediately, making it easy to judge reliability before hitting share.
            </p>
          </div>
          <div className={styles.factCard}>
            <p className={styles.factStatistic}>Warnings Where It Matters</p>
            <p className={styles.factDescription}>
              Our Suspicion Score highlights emotional triggers, urgency cues, and classic markers of misinformation hidden in the content.
            </p>
          </div>
          <div className={styles.factCard}>
            <p className={styles.factStatistic}>Analyze Anything—Text or Screenshots</p>
            <p className={styles.factDescription}>
              Just upload a screenshot of any website or social media post—our OCR extracts and checks the hidden text using the same AI engine. 
            </p>
          </div>
        </div>

        <Link href="/analyzer" className={styles.startButton}>
          Start Analysing
        </Link>
      </div>
    </>
  );
}