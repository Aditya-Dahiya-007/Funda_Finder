// // pages/index.js

// import { useState, useEffect, useRef } from 'react';
// import Head from 'next/head';
// import Tesseract from 'tesseract.js';
// import styles from '../styles/Home.module.css';

// export default function Home() {
//   const [inputText, setInputText] = useState('');
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const lineSpeed = 1.5;
//     const gridSize = 20;
//     const heartbeat = {
//       beatLengthPixels: 350, pWaveAmp: 10, qrsSpikeAmp: 60, tWaveAmp: 20,
//     };
//     const lines = [
//   { color: 'rgba(0, 255, 171, 0.8)', width: 1.5, points: [], baseY: canvas.height * 0.2 },
//   { color: 'rgba(0, 255, 171, 0.8)', width: 1.5, points: [], baseY: canvas.height * 0.5 },
//   { color: 'rgba(0, 255, 171, 0.8)', width: 1.5, points: [], baseY: canvas.height * 0.8 },
// ];


//     function drawGrid() {
//       ctx.strokeStyle = 'rgba(0, 255, 171, 0.05)';
//       ctx.lineWidth = 0.5;
//       ctx.beginPath();
//       for (let x = 0; x < canvas.width; x += gridSize) {
//         ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
//       }
//       for (let y = 0; y < canvas.height; y += gridSize) {
//         ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
//       }
//       ctx.stroke();
//     }

//     function getHeartbeatWaveY(xPosition) {
//         const progress = (xPosition % heartbeat.beatLengthPixels) / heartbeat.beatLengthPixels;
//         if (progress > 0.1 && progress < 0.2) {
//             const pProgress = (progress - 0.1) / 0.1;
//             return -(Math.sin(pProgress * Math.PI) * heartbeat.pWaveAmp);
//         }
//         if (progress > 0.25 && progress < 0.35) {
//             const qrsProgress = (progress - 0.25) / 0.1;
//             if (qrsProgress < 0.5) return -(qrsProgress * 2 * heartbeat.qrsSpikeAmp);
//             return -((1 - (qrsProgress - 0.5) * 2) * heartbeat.qrsSpikeAmp);
//         }
//         if (progress > 0.5 && progress < 0.8) {
//             const tProgress = (progress - 0.5) / 0.3;
//             return -(Math.sin(tProgress * Math.PI) * heartbeat.tWaveAmp);
//         }
//         return 0;
//     }

//     let scrollOffset = 0;
//     let animationFrameId;

//     function animate() {
//       scrollOffset += lineSpeed;
//       // --- FIX #1: RESTORE THE CLEARRECT ---
//       // This clears the canvas to transparent, allowing the body's gradient to show through.
//       // It's essential for the animation to look like it's moving.
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
      
//       drawGrid();

//       lines.forEach(line => {
//         let lastX = line.points.length ? line.points[line.points.length-1].x : scrollOffset - lineSpeed;
//         while(lastX < scrollOffset + canvas.width) {
//             lastX += 5;
//             line.points.push({ x: lastX, y: line.baseY + getHeartbeatWaveY(lastX) });
//         }
//         line.points = line.points.filter(p => p.x > scrollOffset - 10);
        
//         // --- FIX #2: ADD A SAFETY CHECK ---
//         // This prevents the script from crashing if there are no points to draw.
//         if (line.points.length === 0) return;

//         ctx.beginPath();
//         ctx.moveTo(line.points[0].x - scrollOffset, line.points[0].y);
//         for (let i = 1; i < line.points.length; i++) {
//             ctx.lineTo(line.points[i].x - scrollOffset, line.points[i].y);
//         }
//         ctx.strokeStyle = line.color;
//         ctx.lineWidth = line.width;
//         ctx.shadowColor = line.color;
//         ctx.shadowBlur = 5;
//         ctx.stroke();
//       });

//       animationFrameId = requestAnimationFrame(animate);
//     }

//     const handleResize = () => {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         lines[0].baseY = canvas.height * 0.2;
//         lines[1].baseY = canvas.height * 0.5;
//         lines[2].baseY = canvas.height * 0.8;
//         lines.forEach(line => line.points = []);
//         scrollOffset = 0;
//     };

//     window.addEventListener('resize', handleResize);
//     animate();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener('resize', handleResize);
//     };

//   }, []);

//   const handleImageUpload = async (event) => {
//     const imageFile = event.target.files[0];
//     if (!imageFile) return;

//     setIsLoading(true);
//     setAnalysisResult(null);
//     setError('');
//     setInputText('Processing image, this may take a moment...');

//     try {
//       const { data: { text } } = await Tesseract.recognize(imageFile, 'eng');
//       setInputText(text);
//     } catch (err) {
//       setError('Failed to process image. Please try again.');
//       setInputText('');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!inputText.trim()) {
//       setError('Please enter text or upload an image to analyze.');
//       return;
//     }

//     setIsLoading(true);
//     setAnalysisResult(null);
//     setError('');

//     let textToAnalyze = inputText;
//     const CHAR_LIMIT = 15000;
//     if (textToAnalyze.length > CHAR_LIMIT) {
//       textToAnalyze = textToAnalyze.substring(0, CHAR_LIMIT);
//     }

//     try {
//       const response = await fetch('/api/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ textToAnalyze }),
//       });

//       if (!response.ok) {
//         throw new Error(`Error from API: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setAnalysisResult(data);
//     } catch (err) {
//       setError('Failed to get analysis. Please check your API key and account status.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     // We use a React Fragment <> to wrap everything
//     <>
//       {/* The canvas is now OUTSIDE the main container */}
//       <canvas ref={canvasRef} className={styles.canvasBackground} />

//       <div className={styles.container}>
//         <Head>
//           <title>Credibility Lens</title>
//           <meta name="description" content="AI tool to analyze text for misinformation" />
//           <link rel="icon" href="/favicon.ico" />
//         </Head>

//         <header className={styles.header}>
//           <span className={styles.logo}>🔎</span>
//           <h1 className={styles.headerTitle}>Credibility Lens</h1>
//         </header>
        
//         <main className={styles.mainCard}>
//           <p className={styles.description}>
//             Uncover the truth. Paste text or upload a screenshot for an instant AI analysis.
//           </p>

//           <form onSubmit={handleSubmit}>
//             <textarea
//               className={styles.textarea}
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               placeholder="Paste the text you want to analyze here..."
//               rows="8"
//               disabled={isLoading}
//             />
//             <div className={styles.buttonGroup}>
//               <label className={styles.uploadButton}>
//                 Upload Image
//                 <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isLoading} style={{ display: 'none' }} />
//               </label>
//               <button type="submit" className={styles.submitButton} disabled={isLoading}>
//                 Analyze Text
//               </button>
//             </div>
//           </form>

//           {isLoading && (
//             <div className={styles.loaderContainer}>
//               <div className={styles.loader}></div>
//             </div>
//           )}

//           {error && <p className={styles.error}>{error}</p>}

//           {analysisResult && (
//             <div className={styles.resultsCard}>
//               <div className={styles.scoresContainer}>
//                 <div className={styles.score}>
//                   <div 
//                     className={styles.progressCircle} 
//                     style={{'--value': `${analysisResult.credibilityScore}%`}}
//                   >
//                     <span className={styles.scoreValue}>{analysisResult.credibilityScore}</span>
//                   </div>
//                   <span className={styles.scoreLabel}>Credibility</span>
//                 </div>
//                 <div className={styles.score}>
//                   <div 
//                     className={`${styles.progressCircle} ${styles.suspicionCircle}`}
//                     style={{'--value': `${analysisResult.suspicionScore}%`}}
//                   >
//                     <span className={styles.scoreValue}>{analysisResult.suspicionScore}</span>
//                   </div>
//                   <span className={styles.scoreLabel}>Suspicion</span>
//                 </div>
//               </div>

//               <div className={styles.reasoning}>
//                 <h3>Reasoning</h3>
//                 <p>{analysisResult.reasoning}</p>
//               </div>

//               <div className={styles.tips}>
//                 <h3>Verification Tips</h3>
//                 <ul>
//                   {analysisResult.tips.map((tip, index) => <li key={index}>{tip}</li>)}
//                 </ul>
//               </div>

//               <div className={styles.sources}>
//                 <h3>Alternative Sources</h3>
//                 <ul>
//                   {analysisResult.alternativeSources.map((source, index) => (
//                     <li key={index}>
//                       <a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </>
//   );
// }
// pages/index.js
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Tesseract from 'tesseract.js';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lineSpeed = 3.5;
    const gridSize = 20;

    // Base heartbeat parameters
    const heartbeat = {
      beatLengthPixels: 350,
      pWaveAmp: 10,
      qrsSpikeAmp: 60,
      tWaveAmp: 20,
    };

    // Neon ECG lines (different colors + desync offsets)
    const lines = [
      { color: 'rgba(0, 255, 171, 0.85)', width: 1.5, points: [], baseY: canvas.height * 0.2, phaseOffset: 0 },
      { color: 'rgba(0, 200, 255, 0.85)', width: 1.5, points: [], baseY: canvas.height * 0.5, phaseOffset: 80 },
      { color: 'rgba(200, 100, 255, 0.85)', width: 1.5, points: [], baseY: canvas.height * 0.8, phaseOffset: 160 },
    ];

    // Random variations per beat
    let beatVariations = {};
    function getVariation(beatIndex) {
      if (!beatVariations[beatIndex]) {
        beatVariations[beatIndex] = {
          p: heartbeat.pWaveAmp * (0.8 + Math.random() * 0.4),   // 80–120%
          qrs: heartbeat.qrsSpikeAmp * (0.9 + Math.random() * 0.2),
          t: heartbeat.tWaveAmp * (0.7 + Math.random() * 0.6),
        };
      }
      return beatVariations[beatIndex];
    }

    function getHeartbeatWaveY(xPosition, phaseOffset = 0) {
      const shiftedX = xPosition + phaseOffset; // apply desync
      const beatIndex = Math.floor(shiftedX / heartbeat.beatLengthPixels);
      const variation = getVariation(beatIndex);
      const progress = (shiftedX % heartbeat.beatLengthPixels) / heartbeat.beatLengthPixels;

      if (progress > 0.1 && progress < 0.2) {
        const pProgress = (progress - 0.1) / 0.1;
        return -(Math.sin(pProgress * Math.PI) * variation.p);
      }
      if (progress > 0.25 && progress < 0.35) {
        const qrsProgress = (progress - 0.25) / 0.1;
        if (qrsProgress < 0.5) return -(qrsProgress * 2 * variation.qrs);
        return -((1 - (qrsProgress - 0.5) * 2) * variation.qrs);
      }
      if (progress > 0.5 && progress < 0.8) {
        const tProgress = (progress - 0.5) / 0.3;
        return -(Math.sin(tProgress * Math.PI) * variation.t);
      }
      return 0;
    }

    function drawGrid() {
      ctx.strokeStyle = 'rgba(0, 255, 171, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    }

    let scrollOffset = 0;
    let animationFrameId;

    function animate() {
      scrollOffset += lineSpeed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid();

      lines.forEach(line => {
        let lastX = line.points.length ? line.points[line.points.length-1].x : scrollOffset - lineSpeed;
        while(lastX < scrollOffset + canvas.width) {
          lastX += 5;
          // heartbeat + slight random baseline noise
          const y = line.baseY + getHeartbeatWaveY(lastX, line.phaseOffset) + (Math.random() - 0.5) * 2;
          line.points.push({ x: lastX, y });
        }
        line.points = line.points.filter(p => p.x > scrollOffset - 10);

        if (line.points.length === 0) return;

        ctx.beginPath();
        ctx.moveTo(line.points[0].x - scrollOffset, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) {
          ctx.lineTo(line.points[i].x - scrollOffset, line.points[i].y);
        }
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.shadowColor = line.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lines[0].baseY = canvas.height * 0.2;
      lines[1].baseY = canvas.height * 0.5;
      lines[2].baseY = canvas.height * 0.8;
      lines.forEach(line => line.points = []);
      scrollOffset = 0;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };

  }, []);

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

    let textToAnalyze = inputText;
    const CHAR_LIMIT = 15000;
    if (textToAnalyze.length > CHAR_LIMIT) {
      textToAnalyze = textToAnalyze.substring(0, CHAR_LIMIT);
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textToAnalyze }),
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
    <>
      {/* Canvas background */}
      <canvas ref={canvasRef} className={styles.canvasBackground} />

      <div className={styles.container}>
        <Head>
          <title>Credibility Lens</title>
          <meta name="description" content="AI tool to analyze text for misinformation" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className={styles.header}>
          <Link href="/" className={styles.homeLink}>
            <video 
              src="/logo.mp4" 
              className={styles.logoVideo} 
              autoPlay 
              loop 
              muted 
              playsInline 
            />
            <h1 className={styles.headerTitle}>फंडा Finder</h1>
          </Link>
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
              <div className={styles.verifiedSourcesContainer}>
                <Link href="/sources" className={styles.verifiedSourcesButton}>
                  ✅ Verified Sources
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
