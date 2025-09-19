// pages/sources.js

import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Sources.module.css';

// Data for the trusted sources
// pages/sources.js

// Replace the existing trustedSources array with this one
const trustedSources = [
  {
    name: 'Reuters',
    description: 'A global news organization known for its commitment to accuracy, impartiality, and providing in-depth, high-quality news coverage.',
    url: 'https://www.reuters.com/fact-check',
    icon: '/icons/reuters.svg', // Relative path
  },
  {
    name: 'Associated Press (AP)',
    description: 'An independent global news organization dedicated to factual reporting. Its fact-checking division is highly respected for its nonpartisan analysis.',
    url: 'https://apnews.com/hub/ap-fact-check',
    icon: '/icons/ap.png', // Relative path
  },
  {
    name: 'BBC News',
    description: 'A public service broadcaster with a global reputation for impartial news. Its "Reality Check" feature debunks misinformation.',
    url: 'https://www.bbc.com/news/reality_check',
    icon: '/icons/bbc.png', // Relative path
  },
  {
    name: 'Snopes',
    description: 'One of the oldest and most well-known fact-checking websites, investigating urban legends, rumors, and viral misinformation.',
    url: 'https://www.snopes.com',
    icon: '/icons/snopes.png', // Relative path
  },
  {
    name: 'PolitiFact',
    description: 'A Pulitzer Prize-winning fact-checking website that rates the accuracy of claims by public officials and other influential figures.',
    url: 'https://www.politifact.com',
    icon: '/icons/politifact.png', // Relative path
    isWide: true, 
  },
  {
    name: 'FactCheck.org',
    description: 'A nonpartisan, nonprofit "consumer advocate" for voters that aims to reduce the level of deception in U.S. politics.',
    url: 'https://www.factcheck.org',
    icon: '/icons/factcheck.png', // Relative path
  },
  {
    name: 'NPR',
    description: 'National Public Radio is a non-profit media organization that produces and distributes news and cultural programming.',
    url: 'https://www.npr.org',
    icon: '/icons/npr.png', // Relative path
  },
  {
    name: 'The Wall Street Journal',
    description: 'A U.S. business-focused newspaper with a global audience, known for its in-depth financial and economic reporting.',
    url: 'https://www.wsj.com',
    icon: '/icons/wsj.png', // Relative path
  },
  {
    name: 'The New York Times',
    description: 'A globally influential newspaper of record, providing high-quality journalism across a wide range of topics.',
    url: 'https://www.nytimes.com',
    icon: '/icons/nyt.png', // Relative path
  },
];

export default function SourcesPage() {
  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Verified Sources - Credibility Lens</title>
      </Head>

      <header className={styles.header}>
        <span className={styles.logo}>✅</span>
        <h1 className={styles.headerTitle}>Verified Sources</h1>
      </header>

      <div className={styles.grid}>
        {trustedSources.map((source) => (
          <a href={source.url} key={source.name} target="_blank" rel="noopener noreferrer" className={styles.card}>
            <div className={styles.cardHeader}>
              <img src={source.icon} alt={`${source.name} logo`} className={`${styles.icon} ${source.isWide ? styles.wideIcon : ''}`} />
              <h2 className={styles.name}>{source.name}</h2>
            </div>
            <p className={styles.description}>{source.description}</p>
          </a>
        ))}
      </div>

      <Link href="/analyzer" className={styles.backButton}>
            ← Back to Analyzer
    </Link>
    </div>
  );
}