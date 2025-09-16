// pages/index.js

import { useState } from 'react';
import Head from 'next/head';
import Tesseract from 'tesseract.js';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    setIsLoading(true);
    setAnalysisResult(null);
    setError('');
    setInputText('Processing image, this may take a moment...');

    try {
      const { data: { text } } = await Tesseract.recognize(imageFile, 'eng');
      setInputText(text);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setInputText('');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputText.trim()) {
      setError('Please enter text or upload an image to analyze.');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textToAnalyze: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Error from API: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError('Failed to get analysis. Please check your API key and account status.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Credibility Lens</title>
        <meta name="description" content="AI tool to analyze text for misinformation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <span className={styles.logo}>🔎</span>
        <h1 className={styles.headerTitle}>Credibility Lens</h1>
      </header>
      
      <main className={styles.mainCard}>
        <p className={styles.description}>
          Uncover the truth. Paste text or upload a screenshot for an instant AI analysis.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste the text you want to analyze here..."
            rows="8"
            disabled={isLoading}
          />
          <div className={styles.buttonGroup}>
            <label className={styles.uploadButton}>
              Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isLoading} style={{ display: 'none' }} />
            </label>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              Analyze Text
            </button>
          </div>
        </form>

        {isLoading && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {analysisResult && (
          <div className={styles.resultsCard}>
            <div className={styles.scoresContainer}>
              <div className={styles.score}>
                <div 
                  className={styles.progressCircle} 
                  style={{'--value': `${analysisResult.credibilityScore}%`}}
                >
                  <span className={styles.scoreValue}>{analysisResult.credibilityScore}</span>
                </div>
                <span className={styles.scoreLabel}>Credibility</span>
              </div>
              <div className={styles.score}>
                <div 
                  className={`${styles.progressCircle} ${styles.suspicionCircle}`}
                  style={{'--value': `${analysisResult.suspicionScore}%`}}
                >
                  <span className={styles.scoreValue}>{analysisResult.suspicionScore}</span>
                </div>
                <span className={styles.scoreLabel}>Suspicion</span>
              </div>
            </div>

            <div className={styles.reasoning}>
              <h3>Reasoning</h3>
              <p>{analysisResult.reasoning}</p>
            </div>

            <div className={styles.tips}>
              <h3>Verification Tips</h3>
              <ul>
                {analysisResult.tips.map((tip, index) => <li key={index}>{tip}</li>)}
              </ul>
            </div>

            <div className={styles.sources}>
              <h3>Alternative Sources</h3>
              <ul>
                {analysisResult.alternativeSources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}