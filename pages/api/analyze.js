// pages/api/analyze.js

import { OpenAI } from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Credibility Lens",
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let { textToAnalyze } = req.body;

  if (!textToAnalyze || typeof textToAnalyze !== 'string' || textToAnalyze.trim().length === 0) {
    return res.status(400).json({ message: 'Invalid or empty text provided.' });
  }

  const CHAR_LIMIT = 15000;
  if (textToAnalyze.length > CHAR_LIMIT) {
    textToAnalyze = textToAnalyze.substring(0, CHAR_LIMIT);
  }
  
  const prompt = createPrompt(textToAnalyze);

  try {
    const response = await openrouter.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 2048,
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    
    res.status(200).json(analysis);

  } catch (error) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({ message: "An error occurred while analyzing the text." });
  }
}

function createPrompt(text) {
  return `
    Analyze the following text for misinformation, bias, emotional manipulation, and classic disinformation markers.
    Pay special attention to:
    - Emotional Triggers: anger, fear, outrage, sympathy, or exaggerated emotional language.
    - Urgency Cues: "act now," "share immediately," "they don’t want you to know," "before it’s too late."
    - Classic Misinformation Markers: vague claims ("experts say"), lack of sources, excessive ALL CAPS, exclamation marks, conspiratorial framing, clickbait wording.
    - Source Mentions: If a domain or publisher is included, evaluate its credibility.
      // --- SPECIAL RULE ---
      If the text explicitly mentions a widely recognized, reputable news outlet (e.g., bbc.com, hindustantimes.com, Reuters, AP, The New York Times, etc.), assign a higher credibilityScore and lower suspicionScore to reflect trustworthiness.

    // --- NEW RULES ---
    1. credibilityScore + suspicionScore MUST always equal 100.
    2. Reasoning must always explain the balance between credibility and suspicion.
       - If suspicionScore > 0, mention specific triggers or markers detected.
       - If credibilityScore is high, mention if reputable sources or factual tone were identified.

    Provide your analysis strictly in JSON format:
    {
      "credibilityScore": <integer between 0-100>,
      "suspicionScore": <integer between 0-100>,
      "reasoning": "<one-sentence explanation referencing suspicion cues or credibility factors>",
      "tips": ["<short tip>", "<short tip>", "<short tip>"],
      "alternativeSources": [
        { "name": "<credible outlet>", "url": "<url>" },
        { "name": "<credible outlet>", "url": "<url>" }
      ]
    }

    Text to Analyze:
    ---
    ${text}
    ---
  `;
}

