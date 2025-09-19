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
    - **Emotional Triggers**: anger, fear, outrage, sympathy, or exaggerated emotional language.
    - **Urgency Cues**: phrases like "act now," "don’t miss this," "they don’t want you to know," "share immediately."
    - **Classic Misinformation Markers**: lack of credible sources, vague claims ("experts say"), overuse of ALL CAPS, excessive exclamation marks, conspiratorial framing, clickbait-style titles.
    - **Source Mentions**: If the text references a domain, website, or publisher, evaluate its credibility. 
      // --- SPECIAL RULE ---
      If the text explicitly mentions a widely recognized, reputable news outlet (e.g., bbc.com, hindustantimes.com, Reuters, AP, The New York Times, etc.), you MUST assign a significantly higher credibilityScore to reflect that trustworthiness.

    Provide your analysis strictly in a JSON object format.
    The JSON object must contain:
    - "credibilityScore": An integer between 0 (not credible) and 100 (highly credible).
    - "suspicionScore": An integer between 0 (not suspicious) and 100 (highly suspicious).
    - "reasoning": A brief, one-sentence explanation for the scores, mentioning detected emotional triggers, urgency cues, or misinformation markers if present. If a reputable source was identified, highlight it.
    - "tips": An array of three short, actionable strings to help a user verify the information further.
    - "alternativeSources": An array of JSON objects, each with "name" (string) and "url" (string) pointing to credible outlets covering the same or related topic.

    Text to Analyze:
    ---
    ${text}
    ---
  `;
}
