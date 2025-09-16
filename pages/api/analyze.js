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
      max_tokens: 2048, // <-- ADD THIS LINE to limit the response size
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    
    res.status(200).json(analysis);

  } catch (error) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({ message: "An error occurred while analyzing the text." });
  }
}

function createPrompt(text) {
  // This function remains the same
  return `
    Analyze the following text, which could be from a screenshot or manually entered, for misinformation, bias, and emotional manipulation.
    When analyzing, pay close attention to any URLs, website names, author names, or dates mentioned within the text itself, as these can provide clues about the original source or context.

    Provide your analysis strictly in a JSON object format.
    The JSON object must contain the following keys and data types:
    - "credibilityScore": An integer between 0 (not credible) and 100 (highly credible).
    - "suspicionScore": An integer between 0 (not suspicious) and 100 (highly suspicious).
    - "reasoning": A brief, one-sentence explanation for the scores, highlighting the key indicators found in the text.
    - "tips": An array of three short, actionable strings that advise a user on how to verify the information.
    - "alternativeSources": An array of JSON objects. Each object should have a "name" (string) and a "url" (string) of a credible source covering the same topic. If the topic is broad, provide general fact-checking websites like AP Fact Check or Reuters.

    Text to Analyze:
    ---
    ${text}
    ---
  `;
}